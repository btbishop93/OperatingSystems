/* ------------
Created by Brenden on 12/2/14.
priorityQueue.ts
A simple priority Queue, which is based off of the Queue class.
------------ */
var TSOS;
(function (TSOS) {
    var priorityQueue = (function () {
        function priorityQueue(q) {
            if (typeof q === "undefined") { q = new Array(); }
            this.q = q;
        }
        priorityQueue.prototype.getSize = function () {
            return this.q.length;
        };

        priorityQueue.prototype.isEmpty = function () {
            return (this.q.length == 0);
        };

        priorityQueue.prototype.enqueue = function (element, priority) {
            if (this.q.length == 0) {
                this.q.push(element);
            } else {
                var tempPcb;
                var insert = false;
                for (var i = 0; i < this.q.length; i++) {
                    if (priority < this.q[i].PRIORITY) {
                        tempPcb = this.q[i];
                        insert = true;
                        this.q[i] = element;
                        i = this.q.length;
                    }
                }
                if (insert == false) {
                    this.q[this.q.length] = element;
                } else
                    this.swap(tempPcb, tempPcb.PRIORITY);
            }
        };

        priorityQueue.prototype.swap = function (element, priority) {
            this.enqueue(element, priority);
        };

        priorityQueue.prototype.dequeue = function () {
            var retVal = null;
            if (this.q.length > 0) {
                retVal = this.q.shift();
            }
            return retVal;
        };

        priorityQueue.prototype.toString = function () {
            var retVal = "";
            for (var i in this.q) {
                retVal += "[" + this.q[i] + "] ";
            }
            return retVal;
        };
        return priorityQueue;
    })();
    TSOS.priorityQueue = priorityQueue;
})(TSOS || (TSOS = {}));
