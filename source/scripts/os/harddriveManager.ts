/**
 * Created by Brenden on 12/3/14.
 */

module TSOS {
    export class harddriveManager {

        constructor()
        {
            _HardDrive = new harddrive();
        }

        public updateHDD(){
            _HardDrive.updateHDD();
        }

        public getHDD(loc){
            if(loc){
                return _HardDrive.getHDD(loc);
            }
        }

        public setMemLoc(loc, value){
            if(loc){
                _HardDrive.setHDD(loc, value);
            }
        }

        public resetMem(){
            _HardDrive.initializeHDD();
        }
    }
}
