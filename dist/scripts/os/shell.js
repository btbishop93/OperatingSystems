///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
///<reference path="../utils.ts" />
/* ------------
Shell.ts
The OS Shell - The "command line interface" (CLI) for the console.
------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    var Shell = (function () {
        function Shell() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
        }
        Shell.prototype.init = function () {
            var sc = null;

            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

            // date <string>
            sc = new TSOS.ShellCommand(this.shellDate, "date", "- Sets the date.");
            this.commandList[this.commandList.length] = sc;

            // whereAmI <string>
            sc = new TSOS.ShellCommand(this.shellLoc, "whereami", "- Tells you where you are...beware!");
            this.commandList[this.commandList.length] = sc;

            // bondJokes <string>
            sc = new TSOS.ShellCommand(this.shellBondJokes, "bondjokes", "- Tells you James Bond jokes.");
            this.commandList[this.commandList.length] = sc;

            // status <string>
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "- Allows you to change the status.");
            this.commandList[this.commandList.length] = sc;

            // bsod <string>
            sc = new TSOS.ShellCommand(this.shellBSOD, "bsod", "- Beware!");
            this.commandList[this.commandList.length] = sc;

            // load <string>
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "- Check user input for hex.");
            this.commandList[this.commandList.length] = sc;

            // run <string>
            sc = new TSOS.ShellCommand(this.shellRun, "run", "- Runs the loaded program with Process ID.");
            this.commandList[this.commandList.length] = sc;

            //clearmem <string>
            sc = new TSOS.ShellCommand(this.shellClearmem, "clearmem", "- Clears all contents of memory.");
            this.commandList[this.commandList.length] = sc;

            //runall <string>
            sc = new TSOS.ShellCommand(this.shellRunAll, "runall", "- Runs all the programs loaded.");
            this.commandList[this.commandList.length] = sc;

            //ps <string>
            sc = new TSOS.ShellCommand(this.shellPs, "ps", "- Displays the current PIDs.");
            this.commandList[this.commandList.length] = sc;

            //quantum <string>
            sc = new TSOS.ShellCommand(this.shellQuantum, "quantum", "- Sets the quantum, measured in clock ticks");
            this.commandList[this.commandList.length] = sc;

            // kill <id> - kills the specified process id.
            sc = new TSOS.ShellCommand(this.shellKill, "kill", "- Kills the process based the PID provided");
            this.commandList[this.commandList.length] = sc;

            //getScheduler
            sc = new TSOS.ShellCommand(this.shellGetScheduler, "getscheduler", "- Gets the current scheduling algorithm");
            this.commandList[this.commandList.length] = sc;

            //setScheduler
            sc = new TSOS.ShellCommand(this.shellSetScheduler, "setscheduler", "- Sets the current scheduling algorithm to your choice - rr, fcfs, or priority.");
            this.commandList[this.commandList.length] = sc;

            //read from the HDD
            sc = new TSOS.ShellCommand(this.shellCreate, "create", "- Creates the file specified.");
            this.commandList[this.commandList.length] = sc;

            //setScheduler
            sc = new TSOS.ShellCommand(this.shellRead, "read", "- Reads the file specified from the HDD and displays its content.");
            this.commandList[this.commandList.length] = sc;

            //write new file
            sc = new TSOS.ShellCommand(this.shellWrite, "write", "- Writes a file with specified name to HDD.");
            this.commandList[this.commandList.length] = sc;

            //delete file
            sc = new TSOS.ShellCommand(this.shellDelete, "delete", "- Deletes the file specified from the HDD.");
            this.commandList[this.commandList.length] = sc;

            //format HDD
            sc = new TSOS.ShellCommand(this.shellFormat, "format", "- Formats the HDD.");
            this.commandList[this.commandList.length] = sc;

            //lists all the files on the HDD
            sc = new TSOS.ShellCommand(this.shellLs, "ls", "- Lists all the files currently on the HDD.");
            this.commandList[this.commandList.length] = sc;

            // Display the initial prompt.
            this.putPrompt();
        };

        Shell.prototype.putPrompt = function () {
            _StdOut.putText(this.promptStr);
        };

        Shell.prototype.handleInput = function (buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);

            //
            // Parse the input...
            //
            var userCommand = new TSOS.UserCommand();
            userCommand = this.parseInput(buffer);

            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;

            //
            // Determine the command and execute it.
            //
            // JavaScript may not support associative arrays in all browsers so we have to
            // iterate over the command list in attempt to find a match.  TODO: Is there a better way? Probably.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) {
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {
                    this.execute(this.shellApology);
                } else {
                    this.execute(this.shellInvalidCommand);
                }
            }
        };

        // args is an option parameter, ergo the ? which allows TypeScript to understand that
        Shell.prototype.execute = function (fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();

            // ... call the command function passing in the args...
            fn(args);

            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }

            // ... and finally write the prompt again.
            this.putPrompt();
        };

        Shell.prototype.parseInput = function (buffer) {
            var retVal = new TSOS.UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();

            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);

            // 4.2 Record it in the return value.
            retVal.command = cmd;

            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        };

        //
        // Shell Command Functions.  Again, not part of Shell() class per se', just called from there.
        //
        Shell.prototype.shellInvalidCommand = function () {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Duh. Go back to your Speak & Spell.");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        };

        Shell.prototype.shellCurse = function () {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        };

        Shell.prototype.shellApology = function () {
            if (_SarcasticMode) {
                _StdOut.putText("Okay. I forgive you. This time.");
                _SarcasticMode = false;
            } else {
                _StdOut.putText("For what?");
            }
        };

        Shell.prototype.shellVer = function (args) {
            _CommandArr.push("ver");
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        };

        Shell.prototype.shellHelp = function (args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
            _CommandArr.push("help");
        };

        Shell.prototype.shellShutdown = function (args) {
            _StdOut.putText("Shutting down...");

            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        };

        Shell.prototype.shellCls = function (args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
            _CommandArr.push("cls");
        };

        Shell.prototype.shellMan = function (args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
            _CommandArr.push("man");
        };

        Shell.prototype.shellTrace = function (args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, dumbass.");
                        } else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }

                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
            _CommandArr.push("trace");
        };

        Shell.prototype.shellRot13 = function (args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
            _CommandArr.push("rot13");
        };

        Shell.prototype.shellPrompt = function (args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
            _CommandArr.push("prompt");
        };

        Shell.prototype.shellDate = function (args) {
            var date = new Date();
            _StdOut.putText(" Date: " + date.toLocaleDateString() + " " + date.toLocaleTimeString());
            _CommandArr.push("date");
        };

        Shell.prototype.shellLoc = function (args) {
            var loc = USER_LOC;
            var rand = Math.floor(Math.random() * loc.length);
            var myLoc = loc[rand];

            _StdOut.putText(" Location: " + myLoc);
            _CommandArr.push("whereami");
        };

        Shell.prototype.shellBondJokes = function (args) {
            var loc = BOND_JOKES;
            var rand = Math.floor(Math.random() * loc.length);
            var joke = loc[rand];

            _StdOut.putText(" " + joke);
            _CommandArr.push("bondjokes");
        };

        Shell.prototype.shellStatus = function (args) {
            STATUS = args;
            _StdOut.putText(" Status: " + args);
            _CommandArr.push("status");
        };

        Shell.prototype.shellBSOD = function (args) {
            _StdOut.clearScreen();
            _Canvas = document.getElementById('display');

            // Get a global reference to the drawing context.
            _Canvas.style.backgroundColor = "#0000aa";
            _Canvas.getContext('2d').font = '30pt Calibri';
            _Canvas.getContext('2d').fillStyle = "white";
            _Canvas.getContext('2d').fillText('Blue Screen of Death!', 10, 40);
            _Kernel.krnShutdown();
            _CommandArr.push("bsod");
        };

        Shell.prototype.shellLoad = function (args) {
            var textarea = document.getElementById("taProgramInput");
            var textContent = textarea.value.toString();

            _CommandArr.push("load");

            textContent = textContent.replace(/\s+/g, '');

            var hexChars = /^[0-9A-Z]+$/;

            var memLoad = textContent.length / 2;

            if (hexChars.test(textContent)) {
                var first = 0;
                var second = 1;
                if (_Limit <= 767) {
                    for (var i = _Base; i <= _Limit; i++) {
                        _MemoryManager.setMemLoc(i, "00");
                    }
                    for (var j = _Base; j < (_Base + memLoad); j++) {
                        _MemoryManager.setMemLoc(j, ("" + textContent.charAt(first) + textContent.charAt(second)));
                        first += 2;
                        second += 2;
                    }
                }
                _MemoryManager.updateMem();

                if (_Limit > 767) {
                    //call swap creation- writeOS
                    _SwapData = "" + textContent;
                    for (var z = textContent.length; z < 512; z++) {
                        _SwapData += "0";
                    }
                    if (args) {
                        _SwapPCB = new TSOS.Pcb(0, 0, args[0], _PidAssign, "HDD", "");
                        _ResList.push(_SwapPCB);
                    } else {
                        _SwapPCB = new TSOS.Pcb(0, 0, 0, _PidAssign, "HDD", "");
                        _ResList.push(_SwapPCB);
                    }
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(WRITE_IRQ_OS, ""));
                }

                if (_Limit <= 767) {
                    if (args) {
                        _ResList.push(new TSOS.Pcb(_Base, _Limit, args[0], _PidAssign));
                    } else
                        _ResList.push(new TSOS.Pcb(_Base, _Limit, 0, _PidAssign));
                    _Base += 256;
                    _Limit += 256;
                }
                _MemoryManager.updateMem();
                _StdOut.putText(" Process ID: " + _PidAssign);
                _PidAssign++;
            } else
                _StdOut.putText(" The user program input is invalid.");
        };

        Shell.prototype.shellRun = function (args) {
            _CommandArr.push("run");
            for (var j = 0; j < _ResList.length; j++) {
                if (_ResList[j].PID == args) {
                    _CurrentPid = args;
                    for (var i = 0; i < _ResList.length; i++) {
                        if (_ResList[i].PID == args) {
                            _ReadyQueue.enqueue(_ResList[i]);
                            _ReadyQueue.q[0].STATE = "Running";
                            _CPU.initiateProcess();
                        }
                    }
                    if (_StepModeOn == false) {
                        _CPU.isExecuting = true;
                    }
                    _HasRun = true;
                    return;
                }
            }
            for (var z = 0; z < _ResList.length; z++) {
                if (_ResList[z].PID != args) {
                    _StdOut.putText(" The program you are trying to run is invalid.");
                }
            }
        };

        Shell.prototype.shellRunAll = function () {
            _CommandArr.push("runall");
            if (_Scheduler == "priority") {
                for (var i = 0; i < _ResList.length; i++) {
                    _PriorityQueue.enqueue(_ResList[i], _ResList[i].PRIORITY);
                }
                while (_PriorityQueue.getSize() > 0) {
                    _ReadyQueue.enqueue(_PriorityQueue.dequeue());
                }
            } else {
                for (var i = 0; i < _ResList.length; i++) {
                    _ReadyQueue.enqueue(_ResList[i]);
                }
            }
            _ReadyQueue.q[0].STATE = "Running";
            _CPU.initiateProcess();
            if (_ReadyQueue.q[0] != null) {
                if (_StepModeOn == false) {
                    _CPU.isExecuting = true;
                }
                _HasRun = true;
            } else
                _StdOut.putText(" The program you are trying to run is invalid.");
        };

        Shell.prototype.shellClearmem = function () {
            _CommandArr.push("clearmem");
            _MemoryManager.resetMem();
            _MemoryManager.updateMem();
            _StdOut.putText(" Memory has been cleared.");
        };

        Shell.prototype.shellQuantum = function (args) {
            _CommandArr.push("quantum");

            if (args[0] != null) {
                _Quantum = args;
                _StdOut.putText(" The quantum value has been set to " + args + ".");
            } else {
                _StdOut.putText(" The quantum value is " + _Quantum + ".");
            }
        };

        Shell.prototype.shellKill = function (args) {
            _CommandArr.push("kill");
            for (var i = 0; i < _ReadyQueue.getSize(); i++) {
                if (_ReadyQueue.q[i].PID == args) {
                    var pid = true;
                    var row = document.getElementById("pid" + _ReadyQueue.q[i].PID);
                    row.parentNode.removeChild(row);
                    _ReadyQueue.q.splice(i, 1);
                }
            }
            if (pid == true) {
                //_QuantumCount = _Quantum;
                if (_ReadyQueue.getSize() < 1) {
                    _CPU.isExecuting = false;
                    _CPU.resetCPU();
                }
                _StdOut.putText(" Process PID: " + args + " has been killed.");
            } else
                _StdOut.putText(" The program ID does not exist.");
        };

        Shell.prototype.shellPs = function () {
            _CommandArr.push("ps");
            var output = " PIDs: ";
            for (var i = 0; i < _ReadyQueue.getSize(); i++) {
                var pcb = _ReadyQueue.q[i];
                output = output + pcb.PID;
                if (i < _ReadyQueue.getSize() - 1) {
                    output = output + ", ";
                }
            }
            _StdOut.putText(output);
        };

        Shell.prototype.shellGetScheduler = function () {
            _CommandArr.push("getscheduler");
            _StdOut.putText(" The scheduling algorithm is " + _Scheduler + ".");
        };

        Shell.prototype.shellSetScheduler = function (args) {
            _CommandArr.push("setscheduler");
            if (args == "rr" || args == "fcfs" || args == "priority") {
                _Scheduler = args;
                _StdOut.putText(" The scheduling algorithm has been set to " + args + ".");
                if (args == "rr") {
                    _Quantum = 6;
                }
            } else
                _StdOut.putText(" Please enter a valid scheduling algorithm: fcfs, rr, or priority.");
        };

        Shell.prototype.shellCreate = function (args) {
            _CommandArr.push("create");
            _FILENAME = args[0];
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CREATE_IRQ, ""));
        };

        Shell.prototype.shellRead = function (args) {
            _CommandArr.push("read");
            _FILENAME = args[0];
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(READ_IRQ, ""));
        };

        Shell.prototype.shellWrite = function (args) {
            _CommandArr.push("write");
            _FILENAME = args[0];
            for (var i = 1; i < args.length; i++) {
                var data = args[i];
                data = data.replace(/[""]+/g, '');
                data = data.replace(/\s+/g, '');
                _DATA += data;
            }
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(WRITE_IRQ_USER, ""));
        };

        Shell.prototype.shellDelete = function (args) {
            _CommandArr.push("delete");
            _FILENAME = args[0];
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(DELETE_IRQ, ""));
        };

        Shell.prototype.shellFormat = function () {
            _CommandArr.push("format");
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(FORMAT_IRQ, ""));
        };

        Shell.prototype.shellLs = function (args) {
            var files = _FileList[0];
            for (var i = 1; i < _FileList.length; i++) {
                files += ", " + _FileList[i];
            }
            _StdOut.putText(files);
            _CommandArr.push("ls");
        };
        return Shell;
    })();
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
