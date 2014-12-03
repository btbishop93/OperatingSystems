/* ------------
 Created by Brenden on 12/2/14.
 priorityQueue.ts

 A simple priority Queue, which is based off of the Queue class.

 ------------ */

module TSOS {
    export class priorityQueue {
        constructor(public q = new Array()) {

        }

        public getSize() {
            return this.q.length;
        }

        public isEmpty(){
            return (this.q.length == 0);
        }

        public enqueue(element, priority) {
            if(this.q.length == 0){
                this.q.push(element);
            }
            else{
                var tempPcb;
                var insert = false;
                for (var i = 0; i < this.q.length; i++) {
                    if(priority < this.q[i].PRIORITY){
                        tempPcb = this.q[i];
                        insert = true;
                        this.q[i] = element;
                        i = this.q.length;
                    }
                }
                if(insert == false) {
                    this.q[this.q.length] = element;
                }
                else this.swap(tempPcb, tempPcb.PRIORITY);
            }
        }

        public swap(element, priority){
           this.enqueue(element, priority);
        }

        public dequeue() {
            var retVal = null;
            if (this.q.length > 0) {
                retVal = this.q.shift();
            }
            return retVal;
        }

        public toString() {
            var retVal = "";
            for (var i in this.q) {
                retVal += "[" + this.q[i] + "] ";
            }
            return retVal;
        }
    }
}