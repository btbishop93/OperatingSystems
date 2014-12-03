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
                        td2.style.paddingRight = "15px";
                        var td3 = document.createElement('td');
                        td3.setAttribute('id', "val-" + rowStr);
                        var value = document.createTextNode(bits.substr(4));
                        td3.appendChild(value);
                        td3.style.cssFloat = "left";

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

        public updateHDD() {
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 8; j++) {
                    for (var k = 0; k < 8; k++) {
                        var row = i + ":" + j + ":" + k;
                        var data = sessionStorage.getItem(row);
                        document.getElementById("use-" + row).innerHTML = data.charAt(0);
                        document.getElementById("addr-" + row).innerHTML = data.substr(1, 3);
                        document.getElementById("val-" + row).innerHTML = data.substr(4);
                    }
                }
            }
        }

        public getHDD(loc) {
            return sessionStorage.getItem(loc);
        }

        public setHDD(loc, value) {
            if (loc && (value.length > 4 && value.length < 65)) {
                var gap = 64 - value.length;
                if (gap < 60) {
                    for (var h = 0; h < gap; h++) {
                        value += "~";
                    }
                }
                sessionStorage.setItem(loc, value);
                this.updateHDD();
            }
        }

        public resetHDD() {
            sessionStorage.clear();
            var bits = "0";
            bits += "$$$";
            for (var n = 0; n < 60; n++) {
                bits += "~";
            }
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 8; j++) {
                    for (var k = 0; k < 8; k++) {
                        var row = i + ":" + j + ":" + k;
                        sessionStorage.setItem(row, bits);
                    }
                }
            }
            sessionStorage.setItem("0:0:0", "1" + bits.substring(1));
            this.updateHDD();
        }
    }
}