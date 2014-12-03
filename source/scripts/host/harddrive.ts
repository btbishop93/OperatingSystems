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
                sessionStorage.clear();
                var hddDiv = document.getElementById("hddDisplay");
                var table = document.createElement('TABLE');
                table.setAttribute('id', "table");
                var tableBody = document.createElement('TBODY');
                var rowStr = "";
                var bits = "0";
                bits += "$$$";
                for (var n = 0; n < 60; n++) {
                    bits += "~";
                }
                table.appendChild(tableBody);

                for (var i = 0; i < 4; i++) {
                    rowStr = "" + i;
                    for (var j = 0; j < 8; j++) {
                        rowStr = i + ":" + j;
                        for (var z = 0; z < 8; z++) {
                            rowStr += ":" + z;
                            var tr = document.createElement('tr');
                            tr.setAttribute('id', rowStr);

                            var newRow = document.createTextNode(rowStr);
                            var td = document.createElement('td');
                            td.setAttribute('id', rowStr);
                            td.appendChild(newRow);
                            td.style.paddingLeft = "5px";

                            var td1 = document.createElement('td');
                            td1.setAttribute('id', "use-" + rowStr);
                            var use = document.createTextNode(bits.charAt(0));
                            td1.appendChild(use);
                            td1.style.paddingLeft = "15px";
                            var td2 = document.createElement('td');
                            td2.setAttribute('id', "addr-" + rowStr);
                            var addr = document.createTextNode(bits.substr(1, 3));
                            td2.appendChild(addr);
                            td2.style.paddingLeft = "15px";
                            var td3 = document.createElement('td');
                            td3.setAttribute('id', "val-" + rowStr);
                            var value = document.createTextNode(bits.substr(4));
                            td3.appendChild(value);
                            td3.style.paddingLeft = "15px";

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
                sessionStorage.setItem("0:0:0", "1" + bits.substring(1));
                document.getElementById("use-0:0:0").innerHTML = "1";
        }

        public updateHDD(){

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
                this.updateHDD();
        }
    }
}