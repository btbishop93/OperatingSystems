/**
* Created by Brenden on 12/3/14.
*/
var TSOS;
(function (TSOS) {
    var harddriveManager = (function () {
        function harddriveManager() {
            _HardDrive = new TSOS.harddrive();
        }
        harddriveManager.prototype.updateHDD = function () {
            _HardDrive.updateHDD();
        };

        harddriveManager.prototype.getHDD = function (loc) {
            if (loc) {
                return _HardDrive.getHDD(loc);
            }
        };

        harddriveManager.prototype.setMemLoc = function (loc, value) {
            if (loc) {
                _HardDrive.setHDD(loc, value);
            }
        };

        harddriveManager.prototype.resetMem = function () {
            _HardDrive.initializeHDD();
        };
        return harddriveManager;
    })();
    TSOS.harddriveManager = harddriveManager;
})(TSOS || (TSOS = {}));
