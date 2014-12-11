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
                        if(data[0] === "0"){
                            return row;
                        }
                    }
                }
            }
        }
        public findFileLoc(filename){
            var name = _HardDrive.text2hex(filename);
            console.log(name);
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 8; j++) {
                    for (var k = 1; k < 8; k++) {
                        var row = i + ":" + j + ":" + k;
                        var data = _HardDrive.getHDD(row);
                        data = data.substr(4, name.length);
                        if(data === name){
                            return row;
                        }
                    }
                }
            }
        }

        public create(filename){
            if(filename.indexOf('.') >= 0){
                return false;
            }
            if(!(this.isInHDD(_FileList, filename))) {
                _FileList.push(filename);
                var free = this.allocate();
                _HardDrive.setHDD(free, "1" + "$$$" + filename);
                return true;
            }
            else return false;
        }

        public read(filename){
            if(filename.indexOf('.') >= 0){
                return false;
            }
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
                    for(var j = 0; j < contentStr.length; j++) {
                        var char = contentStr.charAt(j);
                        _StdOut.putText(char);
                    }
                    return true;
                }
            }
            else false;
        }

        public writeOS(pcb){
            if(pcb.SWAP == ""){
                pcb.SWAP = ".swap" + pcb.PID;
                var free = this.allocate();
                _HardDrive.setHDD(free, "1" + "$$$" + pcb.SWAP);
                var nextfree = _HardDrive.nextFreeBlock();
                _HardDrive.setHDD(free, "1" + nextfree[0] + nextfree[2] + nextfree[4] + pcb.SWAP);
                var data = _HardDrive.hex2text(pcb.DATA);
                _HardDrive.setHDD(nextfree, "1$$$" + data);
                _HardDrive.updateHDD();
            }
            else {
                   console.log("Pcb swapname: " + pcb.SWAP);
                   var fileLoc = this.findFileLoc(pcb.SWAP);
                   var file = _HardDrive.getHDD(fileLoc);
                   file = file.substr(1, 3);
                   file = file[0] + ":" + file[1] + ":" + file[2];
                   console.log(file);
                   var data = _HardDrive.hex2text(pcb.DATA);
                   this.swap(pcb.SWAP);
                   _HardDrive.setHDD(file, "1$$$" + data);
                   _HardDrive.updateHDD();
                }
            }

        public writeUser(filename, data){
            if(filename.indexOf('.') >= 0){
                return false;
            }
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

        public deleteFile(filename) {
            if (this.isInHDD(_FileList, filename)) {
                var index = _FileList.indexOf(filename);
                if (index > -1) {
                    _FileList.splice(index, 1);
                }
                var fileLoc = this.findFileLoc(filename);
                var content = _HardDrive.getHDD(fileLoc);
                content = content.substr(1, 3);
                if (content == "$$$") {
                    _HardDrive.setHDD(fileLoc, "0$$$");
                    _HardDrive.updateHDD();
                }
                else {
                    var contentLoc = content.charAt(0) + ":" + content.charAt(1) + ":" + content.charAt(2);
                    _HardDrive.setHDD(fileLoc, "0$$$");
                    while (content != "$$$") {
                        var filec = _HardDrive.getHDD(contentLoc);
                        if (filec != null) {
                            _HardDrive.setHDD(contentLoc, "0$$$");
                            content = filec.substr(1, 3);
                            contentLoc = filec.charAt(1) + ":" + filec.charAt(2) + ":" + filec.charAt(3);
                        }
                    }
                    if (_HardDrive.getHDD(contentLoc) != null) {
                        _HardDrive.setHDD(contentLoc, "0$$$");
                    }
                }
                _HardDrive.updateHDD();
                return true;
            }
            else false;
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

        public swap(filename){
            console.log(filename);
            var fileLoc = this.findFileLoc(filename);
            var content = _HardDrive.getHDD(fileLoc);
            content = content.substr(1, 3);
            if (content == "$$$") {
                _HardDrive.setHDD(fileLoc, "0$$$");
                _HardDrive.updateHDD();
            }
            else {
                var contentLoc = content.charAt(0) + ":" + content.charAt(1) + ":" + content.charAt(2);
                while (content != "$$$") {
                    var filec = _HardDrive.getHDD(contentLoc);
                    if (filec != null) {
                        _HardDrive.setHDD(contentLoc, "0$$$");
                        content = filec.substr(1, 3);
                        contentLoc = filec.charAt(1) + ":" + filec.charAt(2) + ":" + filec.charAt(3);
                    }
                }
                if (_HardDrive.getHDD(contentLoc) != null) {
                    _HardDrive.setHDD(contentLoc, "0$$$");
                }
            }
            _HardDrive.updateHDD();
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

        public format(){
            _HardDrive.resetHDD();
        }
    }
}
