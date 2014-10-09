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

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.

            // lookup pcb
            var Pcb = _ResList[_CurrentPid];

            // get the pc
            var loc = (Pcb.PC + Pcb.start).toString(16);
            // look at that current location in mem
            var opCode = _MemoryManager.getMemLoc(loc);

            Pcb.PC++;
            Pcb.IR = opCode;

            if(opCode == "A9"){
                loc = (Pcb.PC + Pcb.start).toString(16);
                var value = _MemoryManager.getMemLoc(loc);
                Pcb.ACC = parseInt(value);
                this.Acc = parseInt(value);
            }
            else if(opCode == "AD"){
                loc = (Pcb.PC + Pcb.start).toString(16);
                Pcb.PC++;
                var loc2 = (Pcb.PC + Pcb.start).toString(16);
                var value = _MemoryManager.getMemLoc(loc) + _MemoryManager.getMemLoc(loc2);
                Pcb.ACC = parseInt(value, 16);
            }
            
            else if(opCode == "00"){
                this.isExecuting = false;
                this.init();
            }

            this.PC = Pcb.PC;
            this.updateCPU();

        }

        public updateCPU(){
            function replaceContentInContainer(matchID, content) {
                var els = document.getElementById(matchID);
                els.innerHTML = content;
            }
             var Pcb = _ResList[_CurrentPid];

            replaceContentInContainer("pc-value", Pcb.PC);
            replaceContentInContainer("ir-value", Pcb.IR);
            replaceContentInContainer("acc-value", Pcb.ACC);
            replaceContentInContainer("x-value", Pcb.X);
            replaceContentInContainer("y-value", Pcb.Y);
            replaceContentInContainer("z-value", Pcb.Z);
        }
    }
}
