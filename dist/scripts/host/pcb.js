/**
* Created by Brenden on 10/2/14.
*/
var TSOS;
(function (TSOS) {
    var Pcb = (function () {
        function Pcb(base, limit, PID, PC, IR, ACC, X, Y, Z, PRIORITY, STATE, LOC) {
            if (typeof PID === "undefined") { PID = 0; }
            if (typeof PC === "undefined") { PC = 0; }
            if (typeof IR === "undefined") { IR = ""; }
            if (typeof ACC === "undefined") { ACC = 0; }
            if (typeof X === "undefined") { X = 0; }
            if (typeof Y === "undefined") { Y = 0; }
            if (typeof Z === "undefined") { Z = 0; }
            if (typeof PRIORITY === "undefined") { PRIORITY = 0; }
            if (typeof STATE === "undefined") { STATE = "Waiting"; }
            if (typeof LOC === "undefined") { LOC = "Memory"; }
            this.base = base;
            this.limit = limit;
            this.PID = PID;
            this.PC = PC;
            this.IR = IR;
            this.ACC = ACC;
            this.X = X;
            this.Y = Y;
            this.Z = Z;
            this.PRIORITY = PRIORITY;
            this.STATE = STATE;
            this.LOC = LOC;
        }
        Pcb.prototype.resetPcb = function () {
            this.PC = 0;
            this.IR = "0";
            this.ACC = 0;
            this.X = 0;
            this.Y = 0;
            this.Z = 0;
        };
        return Pcb;
    })();
    TSOS.Pcb = Pcb;
})(TSOS || (TSOS = {}));
