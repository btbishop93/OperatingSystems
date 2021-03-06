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
var APP_NAME: string    = "BOSS";   // 'cause Breakfast Open Salad Semi-Conductor
var APP_VERSION: string = "5.3.X";   //

var CPU_CLOCK_INTERVAL: number = 100;   // This is in ms, or milliseconds, so 1000 = 1 second.

var TIMER_IRQ: number = 0;  // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
                            // NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
var KEYBOARD_IRQ: number = 1;

var FF_IRQ: number = 2;

var CREATE_IRQ: number = 3;
var READ_IRQ: number = 4;
var WRITE_IRQ_OS: number = 5;
var WRITE_IRQ_USER: number = 6;
var DELETE_IRQ: number = 7;
var FORMAT_IRQ: number = 8;
var _FILENAME: string = "";
var _DATA: string = "";
var _FileList: string [] = [];

var _pDone: boolean = false;

var USER_LOC: string[] = ["Underneath Obama's bed", "In Bjarne Stroustrup's closet", "The Indian Ocean" , "Marist College", "Russia"];

var BOND_JOKES: string [] = [

    "I heard that James Bond once slept through an earthquake. He was shaken, not stirred.",

    "James Bond prefers his mixed drinks shaken, not stirred. . . So does Michael J Fox.",

    "My therapist wanted to sit down with me and talk about my obsession with James Bond. - You expect me to talk....? I said.",

    "Ah Mr. Bond... I've been expecting you... - Said James Bond's mother as she gave birth.",

    "Earlier, for a fancy dress party, I ordered a James Bond outfit, on-line, and now my computers infected...Bloody spyware.",

    "James Bond is really American.",

    "The best James Bond is Sean Connery."];

var STATUS: string = "good";

var _HasRun: boolean = false;

var _StepModeOn: boolean = false;

var _MemoryManager: TSOS.memoryManager;

var _Memory: TSOS.mem;

var _HardDriveDriver: TSOS.hardDriveDriver;

var _HardDrive: TSOS.harddrive;

var _CommandArr: string[] = [];

var _CommandToggle: number = 0;

var _CurrentMsg: string = "";

var commandList: string [] = ["ver", "date", "whereami", "bondjokes", "rot13", "help", "man", "shutdown", "cls", "trace", "prompt", "status", "bsod", "kill", "ps",
    "runall", "quantum", "clearmem", "run", "load", "getscheduler", "setscheduler", "create", "read", "write", "delete", "format", "ls"];

//
// Global Variables
//

var _SwapPCB: TSOS.Pcb;

var _SwapData: string;

var _PidAssign: number = 0;

var _Quantum: number = 999999999999999;

var _Scheduler: string = "fcfs"

var _QuantumCount: number = 0;

var _Base: number = 0;

var _Limit: number = 255;

var _OneStepPressed: boolean = false;

var _ResList: TSOS.Pcb[] = [];

var _ReadyQueue: TSOS.Queue;

var _PriorityQueue: TSOS.priorityQueue;

var _CurrentPid: number = 0;

var _CPU: TSOS.Cpu;  // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.

var _OSclock: number = 0;  // Page 23.

var _Mode: number = 0;     // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.

var _Canvas: HTMLCanvasElement = null;  // Initialized in hostInit().
var _DrawingContext = null;             // Initialized in hostInit().
var _DefaultFontFamily = "sans";        // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize = 13;
var _FontHeightMargin = 4;              // Additional space added to font size when advancing a line.


var _Trace: boolean = true;  // Default the OS trace to be on.

// The OS Kernel and its queues.
var _Kernel: TSOS.Kernel;
var _KernelInterruptQueue = null;
var _KernelBuffers: any[] = null;
var _KernelInputQueue = null;

// Standard input and output
var _StdIn  = null;
var _StdOut = null;

// UI
var _Console: TSOS.Console;
var _OsShell: TSOS.Shell;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode: boolean = false;

// Global Device Driver Objects - page 12
var _krnKeyboardDriver = null;

var _hardwareClockID: number = null;

// For testing...
var _GLaDOS: any = null;
var Glados: any = null;

var onDocumentLoad = function() {
	TSOS.Control.hostInit();
};
