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
                        if (data[0] == "0") {
                            return row;
                        }
                    }
                }
            }
        };

        hardDriveDriver.prototype.findFileLoc = function (filename) {
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 8; j++) {
                    for (var k = 0; k < 8; k++) {
                        var row = i + ":" + j + ":" + k;
                        var data = _HardDrive.getHDD(row);
                        data = _HardDrive.hex2text(data.substr(4, (filename[0].length * 2)));
                        if (data.substr(0, filename[0].length) == filename[0]) {
                            return row;
                        }
                    }
                }
            }
        };

        hardDriveDriver.prototype.create = function (filename) {
            if (!(this.isInHDD(_FileList, filename[0]))) {
                _FileList += filename[0];
                var free = this.allocate();
                _HardDrive.setHDD(free, "1" + "$$$" + filename);
                return true;
            } else
                return false;
        };

        hardDriveDriver.prototype.read = function (filename) {
            if (this.isInHDD(_FileList, filename)) {
            }
        };

        hardDriveDriver.prototype.writeOS = function (filename, data) {
            if (this.isInHDD(_FileList, filename)) {
            }
        };

        hardDriveDriver.prototype.writeUser = function (filename, data) {
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

        hardDriveDriver.prototype.filterFile = function (file) {
            var f = file;
            var newfile = "";
            for (var i = 4; i < f.length; i++) {
                if (!(f.charAt(i) == "~")) {
                    newfile += f.charAt(i);
                }
            }
            return newfile;
        };

        hardDriveDriver.prototype.deleteFile = function (filename) {
            if (this.isInHDD(_FileList, filename)) {
            }
        };

        hardDriveDriver.prototype.format = function () {
            _HardDrive.resetHDD();
        };
        return hardDriveDriver;
    })();
    TSOS.hardDriveDriver = hardDriveDriver;
})(TSOS || (TSOS = {}));
