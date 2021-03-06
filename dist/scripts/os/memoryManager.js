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
                var pcb = _ReadyQueue.q[0];
                if (loc >= pcb.base && loc <= pcb.limit) {
                    return _Memory.getMemLoc(loc);
                } else {
                    _CPU.resetCPU();
                    var row = document.getElementById("pid" + _ReadyQueue.q[0].PID);
                    row.parentNode.removeChild(row);
                    _ReadyQueue.q = [];
                    _CPU.updateCPU();
                    _Kernel.krnTrapError("Out of memory");
                }
            } else
                return _Memory.getMemLoc(loc);
        };

        memoryManager.prototype.getMemData = function (pcb, loc) {
            var data = "";
            while (loc >= pcb.base && loc <= pcb.limit) {
                data += _Memory.getMemLoc(loc);
                loc++;
            }
            return data;
        };

        memoryManager.prototype.setMemLoc = function (loc, str) {
            str = str.toUpperCase();
            if (_CPU.isExecuting) {
                var pcb = _ReadyQueue.q[0];
                if (loc >= pcb.base && loc <= pcb.limit) {
                    _Memory.setMemLoc(loc, str);
                } else {
                    _CPU.resetCPU();
                    var row = document.getElementById("pid" + _ReadyQueue.q[0].PID);
                    row.parentNode.removeChild(row);
                    _ReadyQueue.q = [];
                    _CPU.updateCPU();
                    _Kernel.krnTrapError("Out of memory");
                }
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
