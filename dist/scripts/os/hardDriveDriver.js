/**
* Created by Brenden on 12/3/14.
*/
var TSOS;
(function (TSOS) {
    var hardDriveDriver = (function () {
        function hardDriveDriver() {
            _HardDrive = new TSOS.harddrive();
        }
        hardDriveDriver.prototype.updateHDD = function () {
            _HardDrive.updateHDD();
        };

        hardDriveDriver.prototype.getHDD = function (loc) {
            if (loc) {
                return _HardDrive.getHDD(loc);
            }
        };

        hardDriveDriver.prototype.setHDD = function (loc, value) {
            if (loc) {
                _HardDrive.setHDD(loc, value);
            }
        };

        hardDriveDriver.prototype.resetHDD = function () {
            _HardDrive.resetHDD();
        };

        hardDriveDriver.prototype.isInHDD = function (array, search) {
            return array.indexOf(search) >= 0;
        };

        hardDriveDriver.prototype.allocate = function () {
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 8; j++) {
                    for (var k = 0; k < 8; k++) {
                        var row = i + ":" + j + ":" + k;
                        var data = _HardDrive.getHDD(row);
                        if (data[0] === "0") {
                            return row;
                        }
                    }
                }
            }
        };
        hardDriveDriver.prototype.findFileLoc = function (filename) {
            var name = _HardDrive.text2hex(filename);
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 8; j++) {
                    for (var k = 1; k < 8; k++) {
                        var row = i + ":" + j + ":" + k;
                        var data = _HardDrive.getHDD(row);
                        data = data.substr(4, name.length);
                        if (data === name) {
                            return row;
                        }
                    }
                }
            }
        };

        hardDriveDriver.prototype.create = function (filename) {
            if (filename.indexOf('.') >= 0) {
                return false;
            }
            if (!(this.isInHDD(_FileList, filename))) {
                _FileList.push(filename);
                var free = this.allocate();
                _HardDrive.setHDD(free, "1" + "$$$" + filename);
                return true;
            } else
                return false;
        };

        hardDriveDriver.prototype.read = function (filename) {
            if (filename.indexOf('.') >= 0) {
                return false;
            }
            if (this.isInHDD(_FileList, filename)) {
                var fileLoc = this.findFileLoc(filename);
                var content = _HardDrive.getHDD(fileLoc);
                content = content.substr(1, 3);
                if (content == "$$$") {
                    return false;
                } else {
                    var fileContent = [];
                    var contentStr = "";
                    var contentLoc = content.charAt(0) + ":" + content.charAt(1) + ":" + content.charAt(2);
                    while (content != "$$$") {
                        var filec = _HardDrive.getHDD(contentLoc);
                        if (filec != null) {
                            fileContent += filec.substr(4);
                            content = filec.substr(1, 3);
                            contentLoc = filec.charAt(1) + ":" + filec.charAt(2) + ":" + filec.charAt(3);
                        }
                    }
                    if (_HardDrive.getHDD(contentLoc) != null) {
                        fileContent += _HardDrive.getHDD(contentLoc);
                    }

                    for (var i = 0; i < fileContent.length; i++) {
                        contentStr += fileContent[i];
                    }

                    contentStr = this.filterContent(contentStr);
                    contentStr = _HardDrive.hex2text(contentStr);
                    for (var j = 0; j < contentStr.length; j++) {
                        var char = contentStr.charAt(j);
                        _StdOut.putText(char);
                    }
                    return true;
                }
            } else
                false;
        };

        hardDriveDriver.prototype.writeOS = function (pcb, swapdata) {
            //if(pcb.SWAP != ""){
            pcb.SWAP = ".swap" + pcb.PID;
            var free = this.allocate();
            _HardDrive.setHDD(free, "1" + "$$$" + pcb.SWAP);
            var nextfree = _HardDrive.nextFreeBlock();
            _HardDrive.setHDD(free, "1" + nextfree[0] + nextfree[2] + nextfree[4] + pcb.SWAP);
            var data = _HardDrive.hex2text(swapdata);
            _HardDrive.setHDD(nextfree, "1$$$" + data);
            _HardDrive.updateHDD();
            //}
            /*else {
            var fileLoc = this.findFileLoc(pcb.SWAP);
            var file = _HardDrive.getHDD(fileLoc);
            file = file.substr(1, 3);
            file = file[0] + ":" + file[1] + ":" + file[2];
            var data = _HardDrive.hex2text(swapdata);
            this.swap(pcb.SWAP);
            _HardDrive.setHDD(file, "1$$$" + data);
            _HardDrive.updateHDD();
            }*/
        };

        hardDriveDriver.prototype.writeUser = function (filename, data) {
            if (filename.indexOf('.') >= 0) {
                return false;
            }
            if (this.isInHDD(_FileList, filename)) {
                if (data.length > 0) {
                    var fileLoc = this.findFileLoc(filename);
                    var file = _HardDrive.getHDD(fileLoc);
                    file = this.filterFile(file);
                    file = _HardDrive.hex2text(file);
                    var free = _HardDrive.nextFreeBlock();
                    _HardDrive.setHDD(fileLoc, "1" + free[0] + free[2] + free[4] + file);
                    _HardDrive.updateHDD();
                    if (_HardDrive.setHDD(free, "1" + "$$$" + data)) {
                        return true;
                    }
                }
            }
        };

        hardDriveDriver.prototype.deleteFile = function (filename) {
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
                } else {
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
            } else
                false;
        };

        hardDriveDriver.prototype.filterFile = function (file) {
            var f = file;
            var newfile = "";
            for (var i = 4; i < f.length; i++) {
                if (!(f.charAt(i) == "~")) {
                    if (f.charAt(i) != null) {
                        newfile += f.charAt(i);
                    }
                }
            }
            return newfile;
        };

        hardDriveDriver.prototype.swap = function (filename) {
            var fileLoc = this.findFileLoc(filename);
            var content = _HardDrive.getHDD(fileLoc);
            content = content.substr(1, 3);
            if (content == "$$$") {
                _HardDrive.setHDD(fileLoc, "0$$$");
                _HardDrive.updateHDD();
            } else {
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
        };

        hardDriveDriver.prototype.swapRead = function (filename) {
            var fileLoc = this.findFileLoc(filename);
            var content = _HardDrive.getHDD(fileLoc);
            content = content.substr(1, 3);
            if (content == "$$$") {
                return "";
            } else {
                var fileContent = [];
                var contentStr = "";
                var contentLoc = content.charAt(0) + ":" + content.charAt(1) + ":" + content.charAt(2);
                while (content != "$$$") {
                    var filec = _HardDrive.getHDD(contentLoc);
                    if (filec != null) {
                        fileContent += filec.substr(4);
                        content = filec.substr(1, 3);
                        contentLoc = filec.charAt(1) + ":" + filec.charAt(2) + ":" + filec.charAt(3);
                    }
                }
                if (_HardDrive.getHDD(contentLoc) != null) {
                    fileContent += _HardDrive.getHDD(contentLoc);
                }

                for (var i = 0; i < fileContent.length; i++) {
                    contentStr += fileContent[i];
                }
                this.swap(filename);
                return contentStr;
            }
        };

        hardDriveDriver.prototype.filterContent = function (content) {
            var f = content;
            var newfile = "";
            for (var i = 0; i < f.length; i++) {
                if (!(f.charAt(i) == "~")) {
                    if (f.charAt(i) != null) {
                        newfile += f.charAt(i);
                    }
                }
            }
            return newfile;
        };

        hardDriveDriver.prototype.format = function () {
            _HardDrive.resetHDD();
        };
        return hardDriveDriver;
    })();
    TSOS.hardDriveDriver = hardDriveDriver;
})(TSOS || (TSOS = {}));
