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
            if (_CPU.isExecuting) {
                var pcb = _ReadyQueue[0];
                if (loc >= pcb.base && loc <= pcb.limit) {
                    return _Memory.getMemLoc(loc);
                } else
                    _Kernel.krnTrapError("Error: Out of Memory!");
            } else
                return _Memory.getMemLoc(loc);
        };

        memoryManager.prototype.setMemLoc = function (loc, str) {
            str = str.toUpperCase();
            if (_CPU.isExecuting) {
                var pcb = _ReadyQueue[0];
                if (loc > pcb.base && loc < pcb.limit) {
                    _Memory.setMemLoc(loc, str);
                } else
                    _Kernel.krnTrapError("Error: Out of Memory!");
            } else
                _Memory.setMemLoc(loc, str);
        };

        memoryManager.prototype.resetMem = function () {
            _Memory.resetMem();
        };
        return memoryManager;
    })();
    TSOS.memoryManager = memoryManager;
})(TSOS || (TSOS = {}));
