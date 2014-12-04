/**
 * Created by Brenden on 12/3/14.
 */

module TSOS {
    export class hardDriveDriver {

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

        public setHDD(loc, value){
            if(loc){
                _HardDrive.setHDD(loc, value);
            }
        }

        public resetHDD(){
            _HardDrive.resetHDD();
        }

        public isInHDD(array, search)
        {
            return array.indexOf(search) >= 0;
        }

        public allocate(){
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 8; j++) {
                    for (var k = 0; k < 8; k++) {
                        var row = i + ":" + j + ":" + k;
                        var data = sessionStorage.getItem(row);
                        if(data.charAt(0) == 0){
                            return row;
                        }
                    }
                }
            }
        }

        public create(filename){
            if(!(this.isInHDD(_FileList, filename))) {
                _FileList += filename;
                return true;
            }
            else return false;
        }

        public read(filename){
            if(this.isInHDD(_FileList, filename)){

            }

        }

        public writeOS(filename, data){
            if(this.isInHDD(_FileList, filename)){

            }
        }

        public writeUser(filename, data){
            if(this.isInHDD(_FileList, filename)){
                if(data.length > 0){
                    var free = this.allocate();
                    
                }
            }
        }

        public deleteFile(filename){
            if(this.isInHDD(_FileList, filename)){

            }
        }

        public format(){
            _HardDrive.resetHDD();
        }
    }
}
