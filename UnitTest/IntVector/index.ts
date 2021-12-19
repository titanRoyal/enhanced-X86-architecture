import * as fs from "fs";
import {
    Assembler
} from "../../src/assembler";
import {
    Memory
} from "../../src/VM/Memory";

let asm = new Assembler();

export function makeIntVector(mem: Memory) {
    let intVector = []
    let io = fs.readFileSync("./io.asm", "utf-8");
    let ioBits = asm.generateBits(io, 0, true);
    let ioOffset = mem.alloc(ioBits.length);
    console.log(ioOffset, ioOffset.toString(16))
    mem.injectCode(ioOffset, ioBits);
    intVector.push(ioOffset.toString(2).padStart(32, "0"));
    return intVector.join("");

}