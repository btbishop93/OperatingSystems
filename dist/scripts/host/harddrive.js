/**
* Created by Brenden on 12/3/14.
*/
var TSOS;
(function (TSOS) {
    var harddrive = (function () {
        function harddrive() {
            this.initializeHDD();
            //this.updateHDD();
        }
        harddrive.prototype.initializeHDD = function () {
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
                        rowStr = "" + i + ":" + "j";
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
                    }
                }
            }
            hddDiv.appendChild(table);
        };

        harddrive.prototype.updateHDD = function () {
            for (var i = 0; 0 < 4; i++) {
                if (document.getElementById("mem-cell-" + i) == null) {
                    return;
                }
            }
        };

        harddrive.prototype.getHDD = function (loc) {
            return sessionStorage.getItem(loc);
        };

        harddrive.prototype.setHDD = function (loc, value) {
            if (loc) {
                return sessionStorage.setItem(loc, value);
            }
        };

        harddrive.prototype.resetMem = function () {
            sessionStorage.clear();
            this.initializeHDD();
        };
        return harddrive;
    })();
    TSOS.harddrive = harddrive;
})(TSOS || (TSOS = {}));
