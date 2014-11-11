///<reference path="../globals.ts" />

/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell.  The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS {

    export class Console {

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public buffer = "",
                    public promptStr = ">") {

        }

        public init(): void {
            this.clearScreen();
            this.resetXY();
        }

        private clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        private resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        public handleInput(): void {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { //     Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    // ... and reset our buffer.
                    this.buffer = "";
                }
                else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Write a case for Ctrl-C.
            }
        }

        public putText(text): void {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            if (text !== "") {
                // Move the current X position.
                var text2 = text.split(" ");
                for (var i = 0; i < text2.length; i++) {
                    if(text2.length > 1) {
                        var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text2[i] + " ");
                    }
                    else {
                        var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text2[i]);
                    }
                    if (offset + this.currentXPosition >= _Canvas.width) {
                        this.advanceLine();
                    }
                    //Draw the text at the current X and Y coordinates.
                    if(text2.length > 1) {
                        _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text2[i]);
                    }
                    else {
                        _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text2[i]);
                    }
                 this.currentXPosition = this.currentXPosition + offset;
                }
             }
         }

        public deleteText() : void {
            if(this.buffer.length > 0) {
                var charSize = _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.buffer.charAt(this.buffer.length-1));
                _DrawingContext.clearRect(this.currentXPosition - charSize, this.currentYPosition - this.currentFontSize, charSize, this.currentFontSize + _DefaultFontSize);
                this.buffer = this.buffer.substring(0, this.buffer.length-1);
                this.currentXPosition -= charSize;
            }
        }

        public upDownComplete(key) : void {
            if(key == 38) {
                if (_CommandArr.length + _CommandToggle > 0) {
                    _DrawingContext.clearRect(0, this.currentYPosition - this.currentFontSize,
                        _Canvas.width, _Canvas.height);
                    this.currentXPosition = 0;
                    this.buffer = "";
                    _StdOut.putText(this.promptStr);
                    if ((_CommandArr.length + _CommandToggle) > 0) {
                        _CommandToggle--;
                        _StdOut.putText(_CommandArr[_CommandArr.length + _CommandToggle]);
                        this.buffer += _CommandArr[_CommandArr.length + _CommandToggle];
                    }
                }
            }
            else if(key == 40) {
                if (_CommandArr.length > 0) {
                    if (_CommandToggle < -1) {
                        _CommandToggle += 1;
                        _DrawingContext.clearRect(0, this.currentYPosition - this.currentFontSize,
                            _Canvas.width, _Canvas.height);
                        this.currentXPosition = 0;
                        this.buffer = "";
                        _StdOut.putText(this.promptStr);
                        _StdOut.putText(_CommandArr[_CommandArr.length + _CommandToggle]);
                        this.buffer += _CommandArr[_CommandArr.length + _CommandToggle];
                    }
                }
            }
        }

        public tabComplete():void {
            var buffWord = this.buffer;
            var buffLength = buffWord.length;
            var match = 0;
            var comm = "";
            for (var i = 0; i < commandList.length; i++) {
                var commWord = commandList[i].substr(0, buffLength);
                if (commWord == buffWord) {
                    match++;
                    comm = commandList[i];
                }
            }
            if (match < 2 && match != 0) {
                _DrawingContext.clearRect(0, this.currentYPosition - this.currentFontSize,
                    _Canvas.width, _Canvas.height);
                this.currentXPosition = 0;
                this.buffer = "";
                _StdOut.putText(this.promptStr);
                _StdOut.putText(comm);
                this.buffer += comm;
            }
        }

        public advanceLine(): void {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            this.currentYPosition += _DefaultFontSize + 
                                     _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                                     _FontHeightMargin;

            // TODO: Handle scrolling. (Project 1)
            if(this.currentYPosition + this.currentFontSize >= _Canvas.height){
                var imgData = _DrawingContext.getImageData(0, this.currentFontSize +
                    _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                    _FontHeightMargin, _Canvas.width, _Canvas.height);
                _DrawingContext.putImageData(imgData, 0, 0);
                this.currentYPosition = _Canvas.height - this.currentFontSize;
            }
        }
    }
 }
