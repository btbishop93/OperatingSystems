/* ------------
Globals.ts
Global CONSTANTS and _Variables.
(Global over both the OS and Hardware Simulation / Host.)
This code references page numbers in the text book:
Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
------------ */
//
// Global "CONSTANTS" (There is currently no const or final or readonly type annotation in TypeScript.)
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//
var APP_NAME = "BOSS";
var APP_VERSION = "5.3.X";

var CPU_CLOCK_INTERVAL = 100;

var TIMER_IRQ = 0;

// NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
var KEYBOARD_IRQ = 1;

var FF_IRQ = 2;

var CREATE_IRQ = 3;
var READ_IRQ = 4;
var WRITE_IRQ_OS = 5;
var WRITE_IRQ_USER = 6;
var DELETE_IRQ = 7;
var FORMAT_IRQ = 8;

var _pDone = false;

var USER_LOC = ["Underneath Obama's bed", "In Bjarne Stroustrup's closet", "The Indian Ocean", "Marist College", "Russia"];

var BOND_JOKES = [
    "I heard that James Bond once slept through an earthquake. He was shaken, not stirred.",
    "James Bond prefers his mixed drinks shaken, not stirred. . . So does Michael J Fox.",
    "My therapist wanted to sit down with me and talk about my obsession with James Bond. - You expect me to talk....? I said.",
    "Ah Mr. Bond... I've been expecting you... - Said James Bond's mother as she gave birth.",
    "Earlier, for a fancy dress party, I ordered a James Bond outfit, on-line, and now my computers infected...Bloody spyware.",
    "James Bond is really American.",
    "The best James Bond is Sean Connery."];

var STATUS = "good";

var _HasRun = false;

var _StepModeOn = false;

var _MemoryManager;

var _Memory;

var _HardDriveDriver;

var _HardDrive;

var _CommandArr = [];

var _CommandToggle = 0;

var _CurrentMsg = "";

var commandList = [
    "ver", "date", "whereami", "bondjokes", "rot13", "help", "man", "shutdown", "cls", "trace", "prompt", "status", "bsod", "kill", "ps",
    "runall", "quantum", "clearmem", "run", "load"];

//
// Global Variables
//
var _PidAssign = 0;

var _Quantum = 6;

var _Scheduler = "fcfs";

var _QuantumCount = 0;

var _Base = 0;

var _Limit = 255;

var _OneStepPressed = false;

var _ResList = [];

var _ReadyQueue;

var _PriorityQueue;

var _CurrentPid = 0;

var _CPU;

var _OSclock = 0;

var _Mode = 0;

var _Canvas = null;
var _DrawingContext = null;
var _DefaultFontFamily = "sans";
var _DefaultFontSize = 13;
var _FontHeightMargin = 4;

var _Trace = true;

// The OS Kernel and its queues.
var _Kernel;
var _KernelInterruptQueue = null;
var _KernelBuffers = null;
var _KernelInputQueue = null;

// Standard input and output
var _StdIn = null;
var _StdOut = null;

// UI
var _Console;
var _OsShell;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode = false;

// Global Device Driver Objects - page 12
var _krnKeyboardDriver = null;

var _hardwareClockID = null;

// For testing...
var _GLaDOS = null;
var Glados = null;

var onDocumentLoad = function () {
    TSOS.Control.hostInit();
};
