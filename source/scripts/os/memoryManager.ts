/**
 * Created by Brenden on 10/2/14.
 */
module TSOS {
    export class memoryManager {

        constructor()
        {
            _Memory = new mem();
        }

        public updateMem(){
            _Memory.updateMem();
        }

        public getMemLoc(loc){
            if(_CPU.isExecuting) {
                var pcb = _ReadyQueue.q[0];
                if (loc >= pcb.base && loc <= pcb.limit) {
                    return _Memory.getMemLoc(loc);
                }
                else {
                    _CPU.resetCPU();
                    var row = document.getElementById("pid" + _ReadyQueue.q[0].PID);
                    row.parentNode.removeChild(row);
                    _ReadyQueue.q = [];
                    _CPU.updateCPU();
                    _Kernel.krnTrapError("Out of memory");
                }
            }
            else return _Memory.getMemLoc(loc);
        }

        public getMemData(pcb, loc){
            var data = "";
            while(loc >= pcb.base && loc <= pcb.limit) {
                data += _Memory.getMemLoc(loc);
                loc++;
            }
            return data;
        }

        public setMemLoc(loc, str){
            str = str.toUpperCase();
            if(_CPU.isExecuting) {
                var pcb = _ReadyQueue.q[0];
                if (loc >= pcb.base && loc <= pcb.limit) {
                    _Memory.setMemLoc(loc, str);
                }
                else {
                    _CPU.resetCPU();
                    var row = document.getElementById("pid" + _ReadyQueue.q[0].PID);
                    row.parentNode.removeChild(row);
                    _ReadyQueue.q = [];
                    _CPU.updateCPU();
                    _Kernel.krnTrapError("Out of memory");
                }
            }
            else _Memory.setMemLoc(loc, str);
        }

        public resetMem(){
            _Memory.resetMem();
        }
    }
}