/* ------------
Kernel.ts
Requires globals.ts
Routines for the Operating System, NOT the host.
This code references page numbers in the text book:
Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
------------ */
var TSOS;
(function (TSOS) {
    var Kernel = (function () {
        function Kernel() {
        }
        //
        // OS Startup and Shutdown Routines
        //
        Kernel.prototype.krnBootstrap = function () {
            TSOS.Control.hostLog("bootstrap", "host"); // Use hostLog because we ALWAYS want this, even if _Trace is off.

            // Initialize our global queues.
            _KernelInterruptQueue = new TSOS.Queue(); // A (currently) non-priority queue for interrupt requests (IRQs).
            _KernelBuffers = new Array(); // Buffers... for the kernel.
            _KernelInputQueue = new TSOS.Queue(); // Where device input lands before being processed out somewhere.
            _Console = new TSOS.Console(); // The command line interface / console I/O device.

            // Initialize the console.
            _Console.init();

            setInterval(function () {
                var status = new Date().toLocaleDateString() + "&emsp;" + new Date().toLocaleTimeString() + "<br> Status: " + STATUS;
                var statusBar = document.getElementById("statusBar");
                statusBar.innerHTML = status;
            }, 1000);

            //Initialize memory manager
            _MemoryManager = new TSOS.memoryManager();
            _HardDriveDriver = new TSOS.hardDriveDriver();
            _ReadyQueue = new TSOS.Queue();
            _PriorityQueue = new TSOS.priorityQueue();

            // Initialize standard input and output to the _Console.
            _StdIn = _Console;
            _StdOut = _Console;

            // Load the Keyboard Device Driver
            this.krnTrace("Loading the keyboard device driver.");
            _krnKeyboardDriver = new TSOS.DeviceDriverKeyboard(); // Construct it.
            _krnKeyboardDriver.driverEntry(); // Call the driverEntry() initialization routine.
            this.krnTrace(_krnKeyboardDriver.status);

            //
            // ... more?
            //
            // Enable the OS Interrupts.  (Not the CPU clock interrupt, as that is done in the hardware sim.)
            this.krnTrace("Enabling the interrupts.");
            this.krnEnableInterrupts();

            // Launch the shell.
            this.krnTrace("Creating and Launching the shell.");
            _OsShell = new TSOS.Shell();
            _OsShell.init();

            // Finally, initiate testing.
            if (_GLaDOS) {
                _GLaDOS.afterStartup();
            }
        };

        Kernel.prototype.krnShutdown = function () {
            this.krnTrace("begin shutdown OS");

            // TODO: Check for running processes.  Alert if there are some, alert and stop.  Else...
            _CPU.isExecuting = false;
            _MemoryManager.resetMem();

            // ... Disable the Interrupts.
            this.krnTrace("Disabling the interrupts.");
            this.krnDisableInterrupts();

            //
            // Unload the Device Drivers?
            // More?
            //
            this.krnTrace("end shutdown OS");
        };

        Kernel.prototype.krnOnCPUClockPulse = function () {
            /* This gets called from the host hardware sim every time there is a hardware clock pulse.
            This is NOT the same as a TIMER, which causes an interrupt and is handled like other interrupts.
            This, on the other hand, is the clock pulse from the hardware (or host) that tells the kernel
            that it has to look for interrupts and process them if it finds any.                           */
            // Check for an interrupt, are any. Page 560
            if (_KernelInterruptQueue.getSize() > 0) {
                // Process the first interrupt on the interrupt queue.
                // TODO: Implement a priority queue based on the IRQ number/id to enforce interrupt priority.
                var interrupt = _KernelInterruptQueue.dequeue();
                this.krnInterruptHandler(interrupt.irq, interrupt.params);
            } else if (_CPU.isExecuting) {
                _CPU.cycle();
                if (_OneStepPressed == true) {
                    _CPU.isExecuting = false;
                }
                _OneStepPressed = false;
            } else {
                this.krnTrace("Idle");
            }
        };

        //
        // Interrupt Handling
        //
        Kernel.prototype.krnEnableInterrupts = function () {
            // Keyboard
            TSOS.Devices.hostEnableKeyboardInterrupt();
            // Put more here.
        };

        Kernel.prototype.krnDisableInterrupts = function () {
            // Keyboard
            TSOS.Devices.hostDisableKeyboardInterrupt();
            // Put more here.
        };

        Kernel.prototype.krnInterruptHandler = function (irq, params) {
            // This is the Interrupt Handler Routine.  Pages 8 and 560. {
            // Trace our entrance here so we can compute Interrupt Latency by analyzing the log file later on.  Page 766.
            this.krnTrace("Handling IRQ~" + irq);

            switch (irq) {
                case TIMER_IRQ:
                    this.krnTimerISR(); // Kernel built-in routine for timers (not the clock).
                    break;
                case KEYBOARD_IRQ:
                    _krnKeyboardDriver.isr(params); // Kernel mode device driver
                    _StdIn.handleInput();
                    break;
                case FF_IRQ:
                    var Pcb = _ReadyQueue.q[0];
                    if (Pcb.X == 1) {
                        _StdOut.putText(Pcb.Y.toString());
                    } else if (Pcb.X == 2) {
                        while ((_MemoryManager.getMemLoc(Pcb.base + Pcb.Y)) != "00") {
                            var y = Pcb.Y;
                            var hexStr = _MemoryManager.getMemLoc(Pcb.base + y);
                            _StdOut.putText(String.fromCharCode(parseInt(hexStr, 16)));
                            Pcb.Y++;
                        }
                    }
                    break;
                case CREATE_IRQ:
                    if (_HardDriveDriver.create(_FILENAME)) {
                        _StdOut.putText("File successfully created with name: " + _FILENAME);
                        _StdOut.advanceLine();
                        _StdOut.putText(">");
                    } else {
                        _StdOut.putText("File failed to create. Check file name, it may be invalid or already exist.");
                        _StdOut.advanceLine();
                        _StdOut.putText(">");
                    }

                    break;
                case READ_IRQ:
                    if (_HardDriveDriver.read(_FILENAME)) {
                        _StdOut.advanceLine();
                        _StdOut.putText(">");
                    } else {
                        _StdOut.putText("File failed to be read. Check file name, it may be invalid.");
                        _StdOut.advanceLine();
                        _StdOut.putText(">");
                    }
                    break;
                case WRITE_IRQ_OS:
                    _HardDriveDriver.writeOS(_SwapPCB, _SwapData);
                    break;
                case WRITE_IRQ_USER:
                    if (_HardDriveDriver.writeUser(_FILENAME, _DATA)) {
                        _StdOut.putText("File has successfully been written.");
                        _StdOut.advanceLine();
                        _StdOut.putText(">");
                    } else {
                        _StdOut.putText("File failed to write. Please check file name or content.");
                        _StdOut.advanceLine();
                        _StdOut.putText(">");
                    }
                    break;
                case DELETE_IRQ:
                    if (_HardDriveDriver.deleteFile(_FILENAME)) {
                        _StdOut.putText("File: " + _FILENAME + " has been deleted.");
                        _StdOut.advanceLine();
                        _StdOut.putText(">");
                    } else {
                        _StdOut.putText("File: " + _FILENAME + " could not been deleted. Please check the filename.");
                        _StdOut.advanceLine();
                        _StdOut.putText(">");
                    }

                    break;
                case FORMAT_IRQ:
                    _HardDriveDriver.format();
                    if (sessionStorage.length > 0) {
                        _StdOut.putText("Successfully formatted HDD.");
                        _StdOut.advanceLine();
                        _StdOut.putText(">");
                    } else {
                        _StdOut.putText("Failed attempt to format HDD.");
                        _StdOut.advanceLine();
                        _StdOut.putText(">");
                    }

                    break;
                default:
                    this.krnTrapError("Invalid Interrupt Request. irq=" + irq + " params=[" + params + "]");
            }
        };

        Kernel.prototype.krnTimerISR = function () {
            // The built-in TIMER (not clock) Interrupt Service Routine (as opposed to an ISR coming from a device driver). {
            // Check multiprogramming parameters and enforce quanta here. Call the scheduler / context switch here if necessary.
        };

        //
        // System Calls... that generate software interrupts via tha Application Programming Interface library routines.
        //
        // Some ideas:
        // - ReadConsole
        // - WriteConsole
        // - CreateProcess
        // - ExitProcess
        // - WaitForProcessToExit
        // - CreateFile
        // - OpenFile
        // - ReadFile
        // - WriteFile
        // - CloseFile
        //
        // OS Utility Routines
        //
        Kernel.prototype.krnTrace = function (msg) {
            // Check globals to see if trace is set ON.  If so, then (maybe) log the message.
            if (_Trace) {
                if (msg === "Idle") {
                    // We can't log every idle clock pulse because it would lag the browser very quickly.
                    if (_OSclock % 10 == 0) {
                        // Check the CPU_CLOCK_INTERVAL in globals.ts for an
                        // idea of the tick rate and adjust this line accordingly.
                        TSOS.Control.hostLog(msg, "OS");
                    }
                } else {
                    TSOS.Control.hostLog(msg, "OS");
                }
            }
        };

        Kernel.prototype.krnTrapError = function (msg) {
            TSOS.Control.hostLog("OS ERROR - TRAP: " + msg);

            // TODO: Display error on console, perhaps in some sort of colored screen. (Perhaps blue?)
            _StdOut.clearScreen();

            _Canvas = document.getElementById('display');

            // Get a global reference to the drawing context.
            _Canvas.style.backgroundColor = "#0000aa";
            _Canvas.getContext('2d').font = '30pt Calibri';
            _Canvas.getContext('2d').fillStyle = "white";
            _Canvas.getContext('2d').fillText('Blue Screen of Death!', 10, 40);

            //_StdOut.putText("Blue Screen of Death!");
            this.krnShutdown();
        };
        return Kernel;
    })();
    TSOS.Kernel = Kernel;
})(TSOS || (TSOS = {}));
