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
                        var data = _HardDrive.getHDD(row);
                        if(data[0] == "0"){
                            return row;
                        }
                    }
                }
            }
        }

        public findFileLoc(filename){
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 8; j++) {
                    for (var k = 0; k < 8; k++) {
                        var row = i + ":" + j + ":" + k;
                        var data = _HardDrive.getHDD(row);
                        data = _HardDrive.hex2text(data.substr(4, (filename[0].length * 2)));
                        if(data.substr(0, filename[0].length) == filename[0]){
                            return row;
                        }
                    }
                }
            }
        }

        public create(filename){
            if(!(this.isInHDD(_FileList, filename[0]))) {
                _FileList += filename[0];
                var free = this.allocate();
                _HardDrive.setHDD(free, "1" + "$$$" + filename);
                return true;
            }
            else return false;
        }

        public read(filename){
            if(this.isInHDD(_FileList, filename)){
                var fileLoc = this.findFileLoc(filename);
                var content = _HardDrive.getHDD(fileLoc);
                content = content.substr(1, 3);
                if(content == "$$$"){
                    return false;
                }
                else{
                    var fileContent = [];
                    var contentStr = "";
                    var contentLoc = content.charAt(0) + ":" + content.charAt(1) + ":" + content.charAt(2);
                    while(content != "$$$"){
                        var filec = _HardDrive.getHDD(contentLoc);
                        if(filec != null){
                            fileContent += filec.substr(4);
                            content = filec.substr(1, 3);
                            contentLoc = filec.charAt(1) + ":" + filec.charAt(2) + ":" + filec.charAt(3);
                        }
                    }
                    if(_HardDrive.getHDD(contentLoc) != null){
                        fileContent += _HardDrive.getHDD(contentLoc);
                    }

                    for(var i = 0; i < fileContent.length; i++){
                        contentStr += fileContent[i];
                    }

                    contentStr = this.filterContent(contentStr);
                    contentStr = _HardDrive.hex2text(contentStr);
                    console.log(contentStr);
                    for(var j = 0; j < contentStr.length; j++) {
                        var char = contentStr.charAt(j);
                        console.log(char);
                        _StdOut.putText(char);
                    }
                    return true;
                }

            }
            else false;

        }

        public writeOS(filename, data){
            if(this.isInHDD(_FileList, filename)){

            }
        }

        public writeUser(filename, data){
            if(this.isInHDD(_FileList, filename)){
                if(data.length > 0){
                    var fileLoc = this.findFileLoc(filename);
                    var file = _HardDrive.getHDD(fileLoc);
                    file = this.filterFile(file);
                    file = _HardDrive.hex2text(file);
                    var free = _HardDrive.nextFreeBlock();
                    _HardDrive.setHDD(fileLoc, "1" + free[0] + free[2] + free[4] + file);
                    _HardDrive.updateHDD();
                    if(_HardDrive.setHDD(free, "1" + "$$$" + data)){
                        return true;
                    }
                }
            }
        }

        public filterFile(file){
            var f = file;
            var newfile = "";
            for(var i = 4; i < f.length; i++){
                if(!(f.charAt(i) == "~")){
                    if(f.charAt(i) != null){
                        newfile += f.charAt(i);
                    }
                }
            }
            return newfile;
        }

        public filterContent(content){
            var f = content;
            var newfile = "";
            for(var i = 0; i < f.length; i++){
                if(!(f.charAt(i) == "~")){
                    if(f.charAt(i) != null){
                        newfile += f.charAt(i);
                    }
                }
            }
            return newfile;
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
