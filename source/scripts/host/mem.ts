/**
 * Created by Brenden on 10/2/14.
 * Could not call it memory for some reason
 * it would not recognize the .ts extension
 */
module TSOS {
    export class mem {

        constructor(
            public Memory: string[] = [])
        {
        for(var i = 0; i < 768; i++) {
                this.Memory[i] = "00";
            }

            var memDiv = document.getElementById("memDisplay");
            var table = document.createElement('TABLE');
            var tableBody = document.createElement('TBODY');
            var row = 0;
            var rowStr = "";
            var start = 0;
            var end = 7;

            table.appendChild(tableBody);

            for (var i = 0; i < 96; i++) {
                rowStr = row.toString(16);
                if (rowStr.length == 3) {
                    rowStr = "0x" + rowStr;
                }
                else if (rowStr.length == 2) {
                    rowStr = "0x0" + rowStr;
                }
                else {
                    rowStr = "0x00" + rowStr;
                }
                var tr = document.createElement('tr');
                tr.setAttribute('id', "row-" + i);
                var newRow = document.createTextNode(rowStr);
                var td = document.createElement('td');
                td.setAttribute('id', "mem-row-" + start);
                td.appendChild(newRow);
                tr.appendChild(td);

                for (start; start < end + 1; start++) {
                    var td = document.createElement('td');
                    td.setAttribute('id', "mem-cell-" + start);
                    if(this.Memory[start] == ""){
                        td.appendChild(document.createTextNode("00"));
                        tr.appendChild(td);
                    }
                    else {
                        td.appendChild(document.createTextNode(this.Memory[start]));
                        tr.appendChild(td);
                    }
                }
                tableBody.appendChild(tr);
                end += 8;
                row += 8;
            }
            memDiv.appendChild(table);
        }

        public updateMem(){
            for(var i = 0; 0 < 768; i++) {
                if(document.getElementById("mem-cell-" + i) == null) {
                    return;
                }
                else document.getElementById("mem-cell-" + i).innerHTML = this.Memory[i];
            }
        }

        public getMemLoc(loc){
            return this.Memory[loc];
        }

        public setMemLoc(loc, str){
            if(str.length == 1){
                str = "0" + str;
            }
            this.Memory[loc] = str;
        }

        public resetMem(){
            for(var i = 0; i < 768; i++) {
                this.Memory[i] = "00";
            }
        }
    }
}