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

module TSOS {

    export class Cpu {

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }

        public updateCPU(){
            function replaceContentInContainer(matchID, content) {
                var els = document.getElementById(matchID);
                els.innerHTML = content;
            }

            if(_ReadyQueue.getSize() > 0) {
                var Pcb = _ReadyQueue.q[0];

                replaceContentInContainer("pc-value", Pcb.PC);
                replaceContentInContainer("ir-value", Pcb.IR);
                replaceContentInContainer("acc-value", Pcb.ACC);
                replaceContentInContainer("x-value", Pcb.X);
                replaceContentInContainer("y-value", Pcb.Y);
                replaceContentInContainer("z-value", Pcb.Z);

                for (var j = 0; j < _ReadyQueue.getSize(); j++) {
                    var Pcb2 = _ReadyQueue.q[j];
                    for (var i = 0; i < _ResList.length; i++) {
                        if (Pcb2.PID == i) {
                            replaceContentInContainer("pid_value" + i, Pcb2.PID);
                            replaceContentInContainer("pc" + i, Pcb2.PC);
                            replaceContentInContainer("ir" + i, Pcb2.IR);
                            replaceContentInContainer("acc" + i, Pcb2.ACC);
                            replaceContentInContainer("xflag" + i, Pcb2.X);
                            replaceContentInContainer("yflag" + i, Pcb2.Y);
                            replaceContentInContainer("zflag" + i, Pcb2.Z);
                            replaceContentInContainer("priority" + i, Pcb2.PRIORITY);
                            replaceContentInContainer("state" + i, Pcb2.STATE);
                            replaceContentInContainer("loc" + i, Pcb2.LOC);
                        }
                    }
                }
            }
        }


        public initiateProcess(){
            var table = document.getElementById('procTable');
            var tableBody = document.createElement('TBODY');
            for(var i = 0; i < _ReadyQueue.getSize(); i++) {
                var j = _ReadyQueue.q[i].PID;
                var tr = document.createElement('tr');
                tr.setAttribute('id', "pid" + j);
                var pid = document.createTextNode(_ReadyQueue.q[i].PID);
                var td1 = document.createElement('td');
                td1.setAttribute('id', "pid_value" + j);

                var pc = document.createTextNode(_ReadyQueue.q[i].PC);
                var td2 = document.createElement('td');
                td2.setAttribute('id', "pc" + j);

                var ir = document.createTextNode(_ReadyQueue.q[i].IR);
                var td3 = document.createElement('td');
                td3.setAttribute('id', "ir" + j);
                td3.style.color = "lightgreen";

                var acc = document.createTextNode(_ReadyQueue.q[i].ACC);
                var td4 = document.createElement('td');
                td4.setAttribute('id', "acc" + j);

                var xflag = document.createTextNode(_ReadyQueue.q[i].X);
                var td5 = document.createElement('td');
                td5.setAttribute('id', "xflag" + j);

                var yflag = document.createTextNode(_ReadyQueue.q[i].Y);
                var td6 = document.createElement('td');
                td6.setAttribute('id', "yflag" + j);

                var zflag = document.createTextNode(_ReadyQueue.q[i].Z);
                var td7 = document.createElement('td');
                td7.setAttribute('id', "zflag" + j);

                var priority = document.createTextNode(_ReadyQueue.q[i].PRIORITY);
                var td8 = document.createElement('td');
                td8.setAttribute('id', "priority" + j);

                var state = document.createTextNode(_ReadyQueue.q[i].STATE);
                var td9 = document.createElement('td');
                td9.setAttribute('id', "state" + j);

                var loc = document.createTextNode(_ReadyQueue.q[i].LOC);
                var td10 = document.createElement('td');
                td10.setAttribute('id', "loc" + j);

                td1.appendChild(pid);
                tr.appendChild(td1);
                td2.appendChild(pc);
                tr.appendChild(td2);
                td3.appendChild(ir);
                tr.appendChild(td3);
                td4.appendChild(acc);
                tr.appendChild(td4);
                td5.appendChild(xflag);
                tr.appendChild(td5);
                td6.appendChild(yflag);
                tr.appendChild(td6);
                td7.appendChild(zflag);
                tr.appendChild(td7);
                td8.appendChild(priority);
                tr.appendChild(td8);
                td9.appendChild(state);
                tr.appendChild(td9);
                td10.appendChild(loc);
                tr.appendChild(td10);
                tableBody.appendChild(tr);
            }
            table.appendChild(tableBody);
        }

        public resetCPU(){
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
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.

            if(_ReadyQueue.getSize() > 0){
                if(_QuantumCount >= _Quantum){
                    var tempPcb = _ReadyQueue.q[0];
                    _ReadyQueue.q[0].STATE = "Waiting";
                    if(_ReadyQueue.getSize() > 1){
                        _ReadyQueue.dequeue();
                    }
                    _ReadyQueue.q[0].STATE = "Running";

                    if(_ReadyQueue.q[0].LOC === "HDD"){
                        var tempData = _MemoryManager.getMemData(tempPcb, tempPcb.base);
                        _ReadyQueue.q[0].LOC = "Memory";
                        _ReadyQueue.q[0].base = tempPcb.base;
                        _ReadyQueue.q[0].limit = tempPcb.limit;
                        this.PC = _ReadyQueue.q[0].PC;
                        this.updateCPU();
                        tempPcb.LOC = "HDD";
                        var first = 0;
                        var second = 1;
                        var textContent = _HardDriveDriver.swapRead(_ReadyQueue.q[0].SWAP);
                        textContent = _HardDriveDriver.filterContent(textContent);
                        _HardDriveDriver.writeOS(tempPcb, tempData);
                        var memLoad = textContent.length / 2;
                        for (var i = (tempPcb.base); i <= tempPcb.limit; i++) {
                                _MemoryManager.setMemLoc(i, "00");
                            }
                            _MemoryManager.updateMem();
                            for (var j = tempPcb.base; j < (tempPcb.base + memLoad); j++) {
                                _MemoryManager.setMemLoc(j, ("" + textContent.charAt(first) + textContent.charAt(second)));
                                first += 2;
                                second += 2;
                            }
                            _MemoryManager.updateMem();
                        }
                    if(_ReadyQueue.getSize() > 0) {
                        _ReadyQueue.enqueue(tempPcb);
                    }
                    _QuantumCount = 0;
                    if(_pDone != true) {
                        Control.hostLog("Scheduling new process", "OS");
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

            if(opCode == "A9"){
                hexLoc = (Pcb.PC + Pcb.base).toString(16);
                Pcb.PC++;
                var value = _MemoryManager.getMemLoc(parseInt(hexLoc, 16));
                Pcb.ACC = parseInt(value, 16);
                this.Acc = parseInt(value, 16);
                _QuantumCount++;
            }
            else if(opCode == "AD"){
                hexLoc = (Pcb.PC + Pcb.base).toString(16);
                Pcb.PC++;
                var hexLoc2 = (Pcb.PC + Pcb.base).toString(16);
                Pcb.PC++;
                var value = _MemoryManager.getMemLoc(parseInt(hexLoc2, 16)) + _MemoryManager.getMemLoc(parseInt(hexLoc, 16));
                Pcb.ACC = parseInt(_MemoryManager.getMemLoc(Pcb.base + parseInt(value, 16)));
                this.Acc = parseInt(_MemoryManager.getMemLoc(Pcb.base + parseInt(value, 16)));
                _QuantumCount++;
            }
            else if(opCode == "8D"){
                hexLoc = (Pcb.PC + Pcb.base).toString(16);
                Pcb.PC++;
                var hexLoc2 = (Pcb.PC + Pcb.base).toString(16);
                Pcb.PC++;
                var value = _MemoryManager.getMemLoc(parseInt(hexLoc2, 16)) + _MemoryManager.getMemLoc(parseInt(hexLoc, 16));
                _MemoryManager.setMemLoc(Pcb.base + parseInt(value, 16), Pcb.ACC.toString(16));
                _MemoryManager.updateMem();
                _QuantumCount++;
            }
            else if(opCode == "6D"){
                hexLoc = (Pcb.PC + Pcb.base).toString(16);
                Pcb.PC++;
                var hexLoc2 = (Pcb.PC + Pcb.base).toString(16);
                Pcb.PC++;
                var value = _MemoryManager.getMemLoc(parseInt(hexLoc2, 16)) + _MemoryManager.getMemLoc(parseInt(hexLoc, 16));
                Pcb.ACC = Pcb.ACC + parseInt(_MemoryManager.getMemLoc(Pcb.base + parseInt(value, 16)));
                this.Acc = this.Acc + parseInt(_MemoryManager.getMemLoc(Pcb.base + parseInt(value, 16)));
                _QuantumCount++;
            }
            else if(opCode == "A2"){
                hexLoc = (Pcb.PC + Pcb.base).toString(16);
                Pcb.PC++;
                var value = _MemoryManager.getMemLoc(parseInt(hexLoc, 16));
                Pcb.X = parseInt(value, 16);
                this.Xreg = parseInt(value, 16);
                _QuantumCount++;
            }
            else if(opCode == "AE"){
                hexLoc = (Pcb.PC + Pcb.base).toString(16);
                Pcb.PC++;
                var hexLoc2 = (Pcb.PC + Pcb.base).toString(16);
                Pcb.PC++;
                var value = _MemoryManager.getMemLoc(parseInt(hexLoc2, 16)) + _MemoryManager.getMemLoc(parseInt(hexLoc, 16));
                var byte = parseInt(_MemoryManager.getMemLoc(Pcb.base + parseInt(value, 16)));
                Pcb.X = byte;
                this.Xreg = byte;
                _QuantumCount++;
            }
            else if(opCode == "A0"){
                hexLoc = (Pcb.PC + Pcb.base).toString(16);
                Pcb.PC++;
                var value = _MemoryManager.getMemLoc(parseInt(hexLoc, 16));
                Pcb.Y = parseInt(value, 16);
                this.Yreg = parseInt(value, 16);
                _QuantumCount++;
            }
            else if(opCode == "AC"){
                hexLoc = (Pcb.PC + Pcb.base).toString(16);
                Pcb.PC++;
                var hexLoc2 = (Pcb.PC + Pcb.base).toString(16);
                Pcb.PC++;
                var value = _MemoryManager.getMemLoc(parseInt(hexLoc2, 16)) + _MemoryManager.getMemLoc(parseInt(hexLoc, 16));
                var byte = parseInt(_MemoryManager.getMemLoc(Pcb.base + parseInt(value, 16)), 16);
                Pcb.Y = byte;
                this.Yreg = byte;
                _QuantumCount++;
            }
            else if(opCode == "EA"){
                Pcb.PC++;
                _QuantumCount++;
            }
            else if(opCode == "EC"){
                hexLoc = (Pcb.PC + Pcb.base).toString(16);
                Pcb.PC++;
                var hexLoc2 = (Pcb.PC + Pcb.base).toString(16);
                Pcb.PC++;
                var value = _MemoryManager.getMemLoc(parseInt(hexLoc2, 16)) + _MemoryManager.getMemLoc(parseInt(hexLoc, 16));
                var byte = parseInt(_MemoryManager.getMemLoc(Pcb.base + parseInt(value, 16)));
                if(byte == Pcb.X){
                    Pcb.Z = 1;
                    this.Zflag = 1;
                }
                else {
                    Pcb.Z = 0;
                    this.Zflag = 0;
                }
                _QuantumCount++;
            }
            else if(opCode == "D0"){
                hexLoc = (Pcb.PC + Pcb.base).toString(16);
                Pcb.PC++;
                var value = _MemoryManager.getMemLoc(parseInt(hexLoc, 16));
                var branch = (Pcb.PC + parseInt(value, 16)) % 256;
                if(Pcb.Z == 0){
                    Pcb.PC = branch;
                }
                _QuantumCount++;
            }
            else if(opCode == "EE"){
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
                _QuantumCount++;
            }
            else if(opCode == "FF"){
                _KernelInterruptQueue.enqueue(new Interrupt(FF_IRQ, ""));
                _QuantumCount++;
            }
            else if(opCode == "00"){
                this.init();
                /*_StdOut.advanceLine();
                _StdOut.putText("PC: " + Pcb.PC.toString() + ", IR: " + Pcb.IR + ", ACC: " + Pcb.ACC.toString() + ", X: "
                    + Pcb.X.toString() + ", Y: " + Pcb.Y.toString() + ", Z: " + Pcb.Z.toString());*/
                if(_ReadyQueue.getSize() < 2){
                    _StdOut.advanceLine();
                    _StdOut.putText(">");
                    this.resetCPU();
                }
                this.isExecuting = false;
                _CurrentPid = -1;
                _HasRun = false;
                if(document.getElementById('btnStepOnOff').className == "stepModeOff"){
                    _StepModeOn = false;
                }

                var row = document.getElementById("pid" + _ReadyQueue.q[0].PID);
                row.parentNode.removeChild(row);

                var tempPcb = _ReadyQueue.q[0];
                _ReadyQueue.q[0].STATE = "Waiting";
                _ReadyQueue.dequeue();
                _ReadyQueue.q[0].STATE = "Running";
                if(_ReadyQueue.q[0].LOC === "HDD"){
                    var tempData = _MemoryManager.getMemData(tempPcb, tempPcb.base);
                    _ReadyQueue.q[0].LOC = "Memory";
                    _ReadyQueue.q[0].base = tempPcb.base;
                    _ReadyQueue.q[0].limit = tempPcb.limit;
                    this.PC = _ReadyQueue.q[0].PC;
                    this.updateCPU();
                    tempPcb.LOC = "HDD";
                    var first = 0;
                    var second = 1;
                    var textContent = _HardDriveDriver.swapRead(_ReadyQueue.q[0].SWAP);
                    textContent = _HardDriveDriver.filterContent(textContent);
                    _HardDriveDriver.writeOS(tempPcb, tempData);
                    var memLoad = textContent.length / 2;
                    for (var i = (tempPcb.base); i <= tempPcb.limit; i++) {
                        _MemoryManager.setMemLoc(i, "00");
                    }
                    _MemoryManager.updateMem();
                    for (var j = tempPcb.base; j < (tempPcb.base + memLoad); j++) {
                        _MemoryManager.setMemLoc(j, ("" + textContent.charAt(first) + textContent.charAt(second)));
                        first += 2;
                        second += 2;
                    }
                    _MemoryManager.updateMem();
                }
                if(_ReadyQueue.getSize() > 0){
                    this.isExecuting = true;
                    _HasRun = true;
                    _HardDrive.resetHDD();
                }
                _QuantumCount = 0;
            }
            else{
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
                if(document.getElementById('btnStepOnOff').className == "stepModeOff"){
                    _StepModeOn = false;
                }

            }
            this.PC = Pcb.PC;
            this.updateCPU();
        }
    }
}
