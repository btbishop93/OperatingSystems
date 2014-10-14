/**
* Created by Brenden on 10/2/14.
*/
var TSOS;
(function (TSOS) {
    var memoryManager = (function () {
        function memoryManager() {
            _Memory = new TSOS.mem();
        }
        memoryManager.prototype.updateMem = function () {
            _Memory.updateMem();
        };

        memoryManager.prototype.getMemLoc = function (loc) {
            return _Memory.getMemLoc(loc);
        };

        memoryManager.prototype.setMemLoc = function (loc, str) {
            _Memory.setMemLoc(loc, str);
        };

        memoryManager.prototype.resetMem = function () {
            _Memory.resetMem();
        };
        return memoryManager;
    })();
    TSOS.memoryManager = memoryManager;
})(TSOS || (TSOS = {}));
