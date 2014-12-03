/**
 * Created by Brenden on 12/3/14.
 */
module TSOS {
    export class harddrive {

            public constructor() {
                this.initializeHDD();
                //this.updateHDD();
            }

            public initializeHDD() {
                var hddDiv = document.getElementById("hddDisplay");
                var table = document.createElement('TABLE');
                table.setAttribute('id', "table");
                var tableBody = document.createElement('TBODY');
                var rowStr = "";
                var bits = "";
                for (var n = 0; n < 64; n++) {
                    bits += "0";
                }
                table.appendChild(tableBody);

                for (var i = 0; i < 4; i++) {
                    rowStr = "" + i;
                    for (var j = 0; j < 7; j++) {
                        rowStr = i + ":" + j;
                        for (var z = 0; z < 7; z++) {
                            rowStr += ":" + z;
                            var tr = document.createElement('tr');
                            tr.setAttribute('id', rowStr);

                            var newRow = document.createTextNode(rowStr);
                            var td = document.createElement('td');
                            td.setAttribute('id', rowStr);
                            td.appendChild(newRow);

                            var td1 = document.createElement('td');
                            td1.setAttribute('id', "use-" + rowStr);
                            var use = document.createTextNode(bits.charAt(0));
                            td1.appendChild(use);
                            var td2 = document.createElement('td');
                            td2.setAttribute('id', "addr-" + rowStr);
                            var addr = document.createTextNode(bits.substr(1, 4));
                            td2.appendChild(addr);
                            var td3 = document.createElement('td');
                            td3.setAttribute('id', "val-" + rowStr);
                            var value = document.createTextNode(bits.substr(4));
                            td3.appendChild(value);

                            tr.appendChild(td);
                            tr.appendChild(td1);
                            tr.appendChild(td2);
                            tr.appendChild(td3);
                            tableBody.appendChild(tr);
                            sessionStorage.setItem(rowStr, bits);
                            rowStr = "" + i + ":" + j;
                        }
                    }
                }
                hddDiv.appendChild(table);
        }

        public updateHDD(){
            /*for(var i = 0; 0 < 4; i++) {
                if(document.getElementById("mem-cell-" + i) == null) {
                    return;
                }
            }*/
        }

        public getHDD(loc){
            return sessionStorage.getItem(loc);
        }

        public setHDD(loc, value){
            if(loc) {
                return sessionStorage.setItem(loc, value);
            }
        }

        public resetMem(){
                sessionStorage.clear();
                this.initializeHDD();
        }
    }
}