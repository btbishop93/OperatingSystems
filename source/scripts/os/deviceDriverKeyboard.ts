///<reference path="deviceDriver.ts" />

/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverKeyboard extends DeviceDriver {

        constructor() {
            // Override the base method pointers.
            super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
        }

        public krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public krnKbdDispatchKeyPress(params) {
            // Parse the params.    TODO: Check that they are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 186) && (keyCode <= 192)) || //
                ((keyCode >= 219) && (keyCode <= 222)) ||
                ((keyCode >= 65) && (keyCode <= 90)) ||   // A..Z
                ((keyCode >= 97) && (keyCode <= 123))) {  // a..z {
                // Determine the character we want to display.
                // Assume it's lowercase...
                if (((keyCode >= 65) && (keyCode <= 90)) ||
                    ((keyCode >= 97) && (keyCode <= 123))) {
                    if (isShifted) {
                        chr = String.fromCharCode(keyCode);
                    }
                    else chr = String.fromCharCode(keyCode + 32);
                }
                if (keyCode == 186 || keyCode == 188 || keyCode == 189 || keyCode == 190 || keyCode == 191) {
                    if (isShifted) {
                        if (keyCode != 189) {
                            chr = String.fromCharCode(keyCode - 128);
                        }
                        else chr = String.fromCharCode(keyCode - 94);
                    }
                    if (!isShifted) {
                        if (keyCode == 186) {
                            chr = String.fromCharCode(keyCode - 127);
                        }
                        else chr = String.fromCharCode(keyCode - 144);
                    }
                }
                if(keyCode == 219 || keyCode == 220 || keyCode == 221){
                    if (isShifted) {
                        chr = String.fromCharCode(keyCode - 96);
                    }
                    else chr = String.fromCharCode(keyCode - 128);
                }
                if(keyCode == 187 || keyCode == 192 || keyCode == 222){
                    if (isShifted) {
                        if(keyCode == 187){
                            chr = String.fromCharCode(keyCode - 144);
                        }
                        if(keyCode == 192){
                            chr = String.fromCharCode(keyCode - 66);
                        }
                        if(keyCode == 222){
                            chr = String.fromCharCode(keyCode - 188);
                        }
                    }
                    else{
                        if(keyCode == 187){
                            chr = String.fromCharCode(keyCode - 126);
                        }
                        if(keyCode == 192){
                            chr = String.fromCharCode(keyCode - 96);
                        }
                        if(keyCode == 222){
                            chr = String.fromCharCode(keyCode - 183);
                        }
                    }
                }
                // ... then check the shift key and re-adjust if necessary.

                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            } else if (((keyCode >= 48) && (keyCode <= 57)) ||   // digits
                        (keyCode == 32)                     ||   // space
                        (keyCode == 13)                     ||  //enter
                        (keyCode == 8)                      ||  // backspace
                        (keyCode == 38)                     ||  // up
                        (keyCode == 40)                     ||  // down
                        (keyCode == 9)) {
                if (isShifted) {
                    if (keyCode == 49 || keyCode == 51 || keyCode == 52 || keyCode == 53) {
                            chr = String.fromCharCode(keyCode - 16);
                        }
                    else if(keyCode == 55 || keyCode == 57){
                            chr = String.fromCharCode(keyCode - 17);
                    }
                    else if(keyCode == 48){
                        chr = String.fromCharCode(keyCode - 7);
                    }
                    else if(keyCode == 50){
                        chr = String.fromCharCode(keyCode + 14);
                    }
                    else if(keyCode == 54){
                        chr = String.fromCharCode(keyCode + 40);
                    }
                    else if(keyCode == 56){
                        chr = String.fromCharCode(keyCode - 14);
                    }

                    else if(keyCode == 32 || keyCode == 13){
                        chr = String.fromCharCode(keyCode);
                    }

                }
                else if(keyCode == 8){
                    _StdOut.deleteText();
                }
                else if(keyCode == 9){
                    _StdOut.tabComplete();
                }
                else if(keyCode == 38 || keyCode == 40){
                    _StdOut.upDownComplete(keyCode);
                }
                else {
                    chr = String.fromCharCode(keyCode);
                    _CommandToggle = 0;
                }
                _KernelInputQueue.enqueue(chr);
            }
        }
    }
}
