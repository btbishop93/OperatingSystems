///<reference path="../globals.ts" />
///<reference path="../os/canvastext.ts" />
/* ------------
Control.ts
Requires globals.ts.
Routines for the hardware simulation, NOT for our client OS itself.
These are static because we are never going to instantiate them, because they represent the hardware.
In this manner, it's A LITTLE BIT like a hypervisor, in that the Document environment inside a browser
is the "bare metal" (so to speak) for which we write code that hosts our client OS.
But that analogy only goes so far, and the lines are blurred, because we are using TypeScript/JavaScript
in both the host and client environments.
This (and other host/simulation scripts) is the only place that we should see "web" code, such as
DOM manipulation and event handling, and so on.  (Index.html is -- obviously -- the only place for markup.)
This code references page numbers in the text book:
Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
------------ */
//
// Control Services
//
var TSOS;
(function (TSOS) {
    var Control = (function () {
        function Control() {
        }
        Control.hostInit = function () {
            // Get a global reference to the canvas.  TODO: Move this stuff into a Display Device Driver, maybe?
            _Canvas = document.getElementById('display');

            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext('2d');

            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            TSOS.CanvasTextFunctions.enable(_DrawingContext); // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun.

            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("taHostLog").value = "";

            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("btnStartOS").focus();

            // Check for our testing and enrichment core.
            if (typeof Glados === "function") {
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
        };

        Control.hostLog = function (msg, source) {
            if (typeof source === "undefined") { source = "?"; }
            // Note the OS CLOCK.
            var clock = _OSclock;

            // Note the REAL clock in milliseconds since January 1, 1970.
            var now = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();

            // Build the log string.
            var str = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now + " })" + "\n";

            var taLog = document.getElementById("taHostLog");

            // Update the log console.
            function replaceContentInContainer(matchClass, content) {
                var els = document.getElementsByClassName(matchClass);
                els[0].innerHTML = content;
            }

            if (msg != _CurrentMsg) {
                var entry = document.createElement("div");
                entry.className = "entry";
                var row = document.createElement("div");
                row.className = "row";
                var row2 = document.createElement("div");
                row2.className = "row";

                var small = document.createElement("small");
                small.className = "left";

                small.appendChild(document.createTextNode(now));

                var small2 = document.createElement("small");
                small2.className = "right";
                small2.appendChild(document.createTextNode(clock.toString()));

                var sourceMsg = document.createElement("strong");
                sourceMsg.className = "sourceMsg";
                sourceMsg.appendChild(document.createTextNode(source + ": " + msg));

                row.appendChild(small);
                row.appendChild(small2);
                entry.insertBefore(row, entry.firstChild);
                row.appendChild(document.createElement("br"));
                row2.appendChild(sourceMsg);
                entry.appendChild(row2);
                taLog.insertBefore(entry, taLog.firstChild);
                entry.appendChild(document.createElement("br"));
            } else if (msg == _CurrentMsg) {
                replaceContentInContainer("left", now);
                replaceContentInContainer("right", clock);
            }

            _CurrentMsg = msg;
            //taLog.value = str + taLog.value;
            // Optionally update a log database or some streaming service.
        };

        //
        // Host Events
        //
        Control.hostBtnStartOS_click = function (btn) {
            // Disable the (passed-in) start button...
            btn.disabled = true;

            // .. enable the Halt and Reset buttons ...
            document.getElementById("btnHaltOS").disabled = false;
            document.getElementById("btnReset").disabled = false;
            document.getElementById("btnOneStep").disabled = false;
            document.getElementById("btnStepOnOff").disabled = false;
            document.getElementById("status").style.visibility = "visible";

            // .. set focus on the OS console display ...
            document.getElementById("display").focus();

            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new TSOS.Cpu();
            _CPU.init();

            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(TSOS.Devices.hostClockPulse, CPU_CLOCK_INTERVAL);

            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new TSOS.Kernel();
            _Kernel.krnBootstrap();
        };

        Control.hostBtnOneStep_click = function (btn) {
            if (_StepModeOn == true) {
                _OneStepPressed = true;
                if (_HasRun == true) {
                    _CPU.isExecuting = true;
                    TSOS.Devices.hostClockPulse();
                }
            }
        };

        Control.hostBtnStepOn_click = function (btn) {
            if (btn.value == "Step Mode: Off") {
                _StepModeOn = true;
                _OneStepPressed = true;
                document.getElementById('btnStepOnOff').className = "stepModeOn";
                btn.value = "Step Mode: On";
            } else if (btn.value == "Step Mode: On") {
                _StepModeOn == false;
                _OneStepPressed = false;
                if (_HasRun == true) {
                    _CPU.isExecuting = true;
                }
                document.getElementById('btnStepOnOff').className = "stepModeOff";
                btn.value = "Step Mode: Off";
            }
        };

        Control.hostBtnHaltOS_click = function (btn) {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");

            // Call the OS shutdown routine.
            _Kernel.krnShutdown();

            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        };

        Control.hostBtnReset_click = function (btn) {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload(true);
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        };
        return Control;
    })();
    TSOS.Control = Control;
})(TSOS || (TSOS = {}));
