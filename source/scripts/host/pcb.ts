/**
 * Created by Brenden on 10/2/14.
 */
module TSOS {

    export class Pcb {

        constructor(public start: number,
                    public end: number,
                    public PC: number = 0,
                    public IR: string = "",
                    public ACC: number = 0,
                    public X: number = 0,
                    public Y: number = 0,
                    public Z: number = 0) {

        }

    }
}