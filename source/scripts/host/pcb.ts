/**
 * Created by Brenden on 10/2/14.
 */
module TSOS {

    export class Pcb {

        constructor(public base: number,
                    public limit: number,
                    public PID: number = 0,
                    public PC: number = 0,
                    public IR: string = "",
                    public ACC: number = 0,
                    public X: number = 0,
                    public Y: number = 0,
                    public Z: number = 0) {

        }

        public resetPcb(): void{
            this.PC = 0;
            this.IR = "0";
            this.ACC = 0;
            this.X = 0;
            this.Y = 0;
            this.Z = 0;
        }

    }
}