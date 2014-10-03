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
            _Memory.getMemLoc(loc);
        }

        public setMemLoc(loc, str){
            _Memory.setMemLoc(loc, str);
        }

        public resetMem(){
            _Memory.resetMem();
        }
    }
}