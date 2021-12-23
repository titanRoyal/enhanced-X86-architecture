import * as fs from "fs";
import {
    Assembler
} from "../../src/assembler";
import {
    Memory
} from "../../src/VM/Memory";

let asm = new Assembler();
let paths = ["./iostr.asm", "./ionum.asm", "./ionewline.asm", "./input.asm"]
export function makeIntVector(mem: Memory) {
    let intVector: string[] = []
    paths.forEach(path => {
        let io = fs.readFileSync(path, "utf-8");
        let ioBits = asm.generateBits(io, 0, true);
        let ioOffset = mem.alloc(ioBits.length);
        mem.injectCode(ioOffset, ioBits);
        intVector.push(ioOffset.toString(2).padStart(32, "0"));
    })

    return intVector.join("");

}