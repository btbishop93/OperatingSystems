///<reference path="deviceDriver.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/* ----------------------------------
DeviceDriverKeyboard.ts
Requires deviceDriver.ts
The Kernel Keyboard Device Driver.
---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    var DeviceDriverKeyboard = (function (_super) {
        __extends(DeviceDriverKeyboard, _super);
        function DeviceDriverKeyboard() {
            // Override the base method pointers.
            _super.call(this, this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
        }
        DeviceDriverKeyboard.prototype.krnKbdDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        };

        DeviceDriverKeyboard.prototype.krnKbdDispatchKeyPress = function (params) {
            // Parse the params.    TODO: Check that they are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";

            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 186) && (keyCode <= 192)) || ((keyCode >= 219) && (keyCode <= 222)) || ((keyCode >= 65) && (keyCode <= 90)) || ((keyCode >= 97) && (keyCode <= 123))) {
                // Determine the character we want to display.
                // Assume it's lowercase...
                if (((keyCode >= 65) && (keyCode <= 90)) || ((keyCode >= 97) && (keyCode <= 123))) {
                    if (isShifted) {
                        chr = String.fromCharCode(keyCode);
                    } else
                        chr = String.fromCharCode(keyCode + 32);
                }
                if (keyCode == 186 || keyCode == 188 || keyCode == 189 || keyCode == 190 || keyCode == 191) {
                    if (isShifted) {
                        if (keyCode != 189) {
                            chr = String.fromCharCode(keyCode - 128);
                        } else
                            chr = String.fromCharCode(keyCode - 94);
                    }
                    if (!isShifted) {
                        if (keyCode == 186) {
                            chr = String.fromCharCode(keyCode - 127);
                        } else
                            chr = String.fromCharCode(keyCode - 144);
                    }
                }
                if (keyCode == 219 || keyCode == 220 || keyCode == 221) {
                    if (isShifted) {
                        chr = String.fromCharCode(keyCode - 96);
                    } else
                        chr = String.fromCharCode(keyCode - 128);
                }
                if (keyCode == 187 || keyCode == 192 || keyCode == 222) {
                    if (isShifted) {
                        if (keyCode == 187) {
                            chr = String.fromCharCode(keyCode - 144);
                        }
                        if (keyCode == 192) {
                            chr = String.fromCharCode(keyCode - 66);
                        }
                        if (keyCode == 222) {
                            chr = String.fromCharCode(keyCode - 188);
                        }
                    } else {
                        if (keyCode == 187) {
                            chr = String.fromCharCode(keyCode - 126);
                        }
                        if (keyCode == 192) {
                            chr = String.fromCharCode(keyCode - 96);
                        }
                        if (keyCode == 222) {
                            chr = String.fromCharCode(keyCode - 183);
                        }
                    }
                }

                // ... then check the shift key and re-adjust if necessary.
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            } else if (((keyCode >= 48) && (keyCode <= 57)) || (keyCode == 32) || (keyCode == 13) || (keyCode == 8) || (keyCode == 38) || (keyCode == 40) || (keyCode == 9)) {
                if (isShifted) {
                    if (keyCode == 49 || keyCode == 51 || keyCode == 52 || keyCode == 53) {
                        chr = String.fromCharCode(keyCode - 16);
                    } else if (keyCode == 55 || keyCode == 57) {
                        chr = String.fromCharCode(keyCode - 17);
                    } else if (keyCode == 48) {
                        chr = String.fromCharCode(keyCode - 7);
                    } else if (keyCode == 50) {
                        chr = String.fromCharCode(keyCode + 14);
                    } else if (keyCode == 54) {
                        chr = String.fromCharCode(keyCode + 40);
                    } else if (keyCode == 56) {
                        chr = String.fromCharCode(keyCode - 14);
                    } else if (keyCode == 32 || keyCode == 13) {
                        chr = String.fromCharCode(keyCode);
                    }
                } else if (keyCode == 8) {
                    _StdOut.deleteText();
                } else if (keyCode == 9) {
                    _StdOut.tabComplete();
                } else if (keyCode == 38 || keyCode == 40) {
                    _StdOut.upDownComplete(keyCode);
                } else {
                    chr = String.fromCharCode(keyCode);
                    _CommandToggle = 0;
                }
                _KernelInputQueue.enqueue(chr);
            }
        };
        return DeviceDriverKeyboard;
    })(TSOS.DeviceDriver);
    TSOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(TSOS || (TSOS = {}));
