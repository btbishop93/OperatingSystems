///<reference path="../globals.ts" />
/* ------------
CPU.ts
Requires global.ts.
Routines for the host CPU simulation, NOT for the OS itself.
In this manner, it's A LITTLE BIT like a hypervisor,
in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
TypeScript/JavaScript in both the host and client environments.
This code references page numbers in the text book:
Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
------------ */
var TSOS;
(function (TSOS) {
    var Cpu = (function () {
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, isExecuting) {
            if (typeof PC === "undefined") { PC = 0; }
            if (typeof Acc === "undefined") { Acc = 0; }
            if (typeof Xreg === "undefined") { Xreg = 0; }
            if (typeof Yreg === "undefined") { Yreg = 0; }
            if (typeof Zflag === "undefined") { Zflag = 0; }
            if (typeof isExecuting === "undefined") { isExecuting = false; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        };

        Cpu.prototype.updateCPU = function () {
            function replaceContentInContainer(matchID, content) {
                var els = document.getElementById(matchID);
                els.innerHTML = content;
            }

            var Pcb = _ReadyQueue.q[0];

            replaceContentInContainer("pc-value", Pcb.PC);
            replaceContentInContainer("ir-value", Pcb.IR);
            replaceContentInContainer("acc-value", Pcb.ACC);
            replaceContentInContainer("x-value", Pcb.X);
            replaceContentInContainer("y-value", Pcb.Y);
            replaceContentInContainer("z-value", Pcb.Z);
        };

        Cpu.prototype.resetCPU = function () {
            function replaceContentInContainer(matchID, content) {
                var els = document.getElementById(matchID);
                els.innerHTML = content;
            }

            replaceContentInContainer("pc-value", 0);
            replaceContentInContainer("ir-value", "0");
            replaceContentInContainer("acc-value", 0);
            replaceContentInContainer("x-value", 0);
            replaceContentInContainer("y-value", 0);
            replaceContentInContainer("z-value", 0);
        };

        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');

            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            if (_ReadyQueue.getSize() > 1) {
                if (_QuantumCount >= _Quantum) {
                    var tempPcb = _ReadyQueue.q[0];
                    _ReadyQueue.dequeue();
                    _ReadyQueue.enqueue(tempPcb);
                    _QuantumCount = 0;
                    if (_pDone != true) {
                        TSOS.Control.hostLog("Scheduling new process", "OS");
                    }
                }
            }

            // lookup pcb
            var Pcb = _ReadyQueue.q[0];

            // get the pc
            var hexLoc = (Pcb.PC + Pcb.base).toString(16);

            // look at that current location in mem
            var opCode = _MemoryManager.getMemLoc(parseInt(hexLoc, 16));

            Pcb.PC++;
            Pcb.IR = opCode;

            function hex2asc(hexStr) {
                var tempstr = '';
                for (var i = 0; i < hexStr.length; i = i + 2) {
                    tempstr = tempstr + String.fromCharCode(parseInt(hexStr.substr(i, 2), 16));
                }
                return tempstr;
            }

            if (opCode == "A9") {
                hexLoc = (Pcb.PC + Pcb.base).toString(16);
                Pcb.PC++;
                var value = _MemoryManager.getMemLoc(parseInt(hexLoc, 16));
                Pcb.ACC = parseInt(value, 16);
                this.Acc = parseInt(value, 16);
            } else if (opCode == "AD") {
                hexLoc = (Pcb.PC + Pcb.base).toString(16);
                Pcb.PC++;
                var hexLoc2 = (Pcb.PC + Pcb.base).toString(16);
                Pcb.PC++;
                var value = _MemoryManager.getMemLoc(parseInt(hexLoc2, 16)) + _MemoryManager.getMemLoc(parseInt(hexLoc, 16));
                Pcb.ACC = parseInt(_MemoryManager.getMemLoc(Pcb.base + parseInt(value, 16)));
                this.Acc = parseInt(_MemoryManager.getMemLoc(Pcb.base + parseInt(value, 16)));
            } else if (opCode == "8D") {
                hexLoc = (Pcb.PC + Pcb.base).toString(16);
                Pcb.PC++;
                var hexLoc2 = (Pcb.PC + Pcb.base).toString(16);
                Pcb.PC++;
                var value = _MemoryManager.getMemLoc(parseInt(hexLoc2, 16)) + _MemoryManager.getMemLoc(parseInt(hexLoc, 16));
                _MemoryManager.setMemLoc(Pcb.base + parseInt(value, 16), Pcb.ACC.toString(16));
                _MemoryManager.updateMem();
            } else if (opCode == "6D") {
                hexLoc = (Pcb.PC + Pcb.base).toString(16);
                Pcb.PC++;
                var hexLoc2 = (Pcb.PC + Pcb.base).toString(16);
                Pcb.PC++;
                var value = _MemoryManager.getMemLoc(parseInt(hexLoc2, 16)) + _MemoryManager.getMemLoc(parseInt(hexLoc, 16));
                Pcb.ACC = Pcb.ACC + parseInt(_MemoryManager.getMemLoc(Pcb.base + parseInt(value, 16)));
                this.Acc = this.Acc + parseInt(_MemoryManager.getMemLoc(Pcb.base + parseInt(value, 16)));
            } else if (opCode == "A2") {
                hexLoc = (Pcb.PC + Pcb.base).toString(16);
                Pcb.PC++;
                var value = _MemoryManager.getMemLoc(parseInt(hexLoc, 16));
                Pcb.X = parseInt(value, 16);
                this.Xreg = parseInt(value, 16);
            } else if (opCode == "AE") {
                hexLoc = (Pcb.PC + Pcb.base).toString(16);
                Pcb.PC++;
                var hexLoc2 = (Pcb.PC + Pcb.base).toString(16);
                Pcb.PC++;
                var value = _MemoryManager.getMemLoc(parseInt(hexLoc2, 16)) + _MemoryManager.getMemLoc(parseInt(hexLoc, 16));
                var byte = parseInt(_MemoryManager.getMemLoc(Pcb.base + parseInt(value, 16)));
                Pcb.X = byte;
                this.Xreg = byte;
            } else if (opCode == "A0") {
                hexLoc = (Pcb.PC + Pcb.base).toString(16);
                Pcb.PC++;
                var value = _MemoryManager.getMemLoc(parseInt(hexLoc, 16));
                Pcb.Y = parseInt(value, 16);
                this.Yreg = parseInt(value, 16);
            } else if (opCode == "AC") {
                hexLoc = (Pcb.PC + Pcb.base).toString(16);
                Pcb.PC++;
                var hexLoc2 = (Pcb.PC + Pcb.base).toString(16);
                Pcb.PC++;
                var value = _MemoryManager.getMemLoc(parseInt(hexLoc2, 16)) + _MemoryManager.getMemLoc(parseInt(hexLoc, 16));
                var byte = parseInt(_MemoryManager.getMemLoc(Pcb.base + parseInt(value, 16)));
                Pcb.Y = byte;
                this.Yreg = byte;
            } else if (opCode == "EA") {
                Pcb.PC++;
            } else if (opCode == "EC") {
                hexLoc = (Pcb.PC + Pcb.base).toString(16);
                Pcb.PC++;
                var hexLoc2 = (Pcb.PC + Pcb.base).toString(16);
                Pcb.PC++;
                var value = _MemoryManager.getMemLoc(parseInt(hexLoc2, 16)) + _MemoryManager.getMemLoc(parseInt(hexLoc, 16));
                var byte = parseInt(_MemoryManager.getMemLoc(Pcb.base + parseInt(value, 16)));
                if (byte == Pcb.X) {
                    Pcb.Z = 1;
                    this.Zflag = 1;
                } else {
                    Pcb.Z = 0;
                    this.Zflag = 0;
                }
            } else if (opCode == "D0") {
                hexLoc = (Pcb.PC + Pcb.base).toString(16);
                Pcb.PC++;
                console.log(hexLoc);
                var value = _MemoryManager.getMemLoc(parseInt(hexLoc, 16));
                var branch = (Pcb.PC + parseInt(value, 16)) % 256;
                console.log(branch);
                if (Pcb.Z == 0) {
                    Pcb.PC = branch;
                }
            } else if (opCode == "EE") {
                hexLoc = (Pcb.PC + Pcb.base).toString(16);
                Pcb.PC++;
                var hexLoc2 = (Pcb.PC + Pcb.base).toString(16);
                Pcb.PC++;
                var value = _MemoryManager.getMemLoc(parseInt(hexLoc2, 16)) + _MemoryManager.getMemLoc(parseInt(hexLoc, 16));
                var currByte = _MemoryManager.getMemLoc(Pcb.base + parseInt(value, 16));
                var byte = parseInt(currByte, 16);
                byte++;
                _MemoryManager.setMemLoc(Pcb.base + parseInt(value, 16), byte.toString(16));
                _MemoryManager.updateMem();
            } else if (opCode == "FF") {
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(FF_IRQ, ""));
            } else if (opCode == "00") {
                this.init();
                this.isExecuting = false;
                _StdOut.advanceLine();
                _StdOut.putText("PC: " + Pcb.PC.toString() + ", IR: " + Pcb.IR + ", ACC: " + Pcb.ACC.toString() + ", X: " + Pcb.X.toString() + ", Y: " + Pcb.Y.toString() + ", Z: " + Pcb.Z.toString());
                _StdOut.advanceLine();
                _StdOut.putText(">");
                Pcb.resetPcb();
                this.updateCPU();
                _CurrentPid = -1;
                _HasRun = false;
                if (document.getElementById('btnStepOnOff').className == "stepModeOff") {
                    _StepModeOn = false;
                }
                _ReadyQueue.dequeue();
                if (_ReadyQueue.getSize() > 0) {
                    this.isExecuting = true;
                }
                _QuantumCount = 0;
            } else {
                this.init();
                this.isExecuting = false;
                _ReadyQueue.dequeue();
                _StdOut.advanceLine();
                _StdOut.putText("Invalid instruction: " + opCode);
                _StdOut.advanceLine();
                _StdOut.putText(">");
                Pcb.resetPcb();
                this.resetCPU();
                _HasRun = false;
                if (document.getElementById('btnStepOnOff').className == "stepModeOff") {
                    _StepModeOn = false;
                }
            }

            this.PC = Pcb.PC;
            this.updateCPU();
            _QuantumCount++;
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
