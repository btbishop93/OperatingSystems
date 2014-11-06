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
                var pcb = _ReadyQueue[0];
                if (loc >= pcb.base && loc <= pcb.limit) {
                    return _Memory.getMemLoc(loc);
                }
                else _Kernel.krnTrapError("Error: Out of Memory!");
            }
            else return _Memory.getMemLoc(loc);
        }

        public setMemLoc(loc, str){
            str = str.toUpperCase();
            if(_CPU.isExecuting) {
                var pcb = _ReadyQueue[0];
                if (loc > pcb.base && loc < pcb.limit) {
                    _Memory.setMemLoc(loc, str);
                }
                else _Kernel.krnTrapError("Error: Out of Memory!");
            }
            else _Memory.setMemLoc(loc, str);
        }

        public resetMem(){
            _Memory.resetMem();
        }
    }
}