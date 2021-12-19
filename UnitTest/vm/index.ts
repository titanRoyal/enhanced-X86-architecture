import {
    Assembler
} from "../../src/assembler";

import CPU from "../../src/VM/cpu";

import {
    Memory
} from "../../src/VM/Memory";

import fs from "fs"

import ps from "prompt-sync"
import {
    makeIntVector
} from "../IntVector";


let prompt = ps();

let txt = fs.readFileSync("../input.asm", "utf-8");

let asm = new Assembler();

// let tokens = asm.generateBits(txt);

// logPrograme(tokens);
let mem = new Memory(0xffffff);
let intVec = makeIntVector(mem);
let intOffset = mem.alloc(intVec.length);
mem.injectCode(intOffset, intVec);
let cpu = new CPU(mem, intOffset);


let offset = 0;
while (true) {
    let prog = asm.generateBits(txt, offset);
    let memOffset = mem.alloc(prog.length)
    let newProg = asm.generateBits(txt, memOffset);
    if (prog.length == newProg.length) {
        mem.injectCode(memOffset, newProg)
        cpu.SetRegister("IP", memOffset);
        logPrograme(newProg);
        break;
    }
}

// mem.injectCode(0, tokens);
// mem.injectCode(0x3000, )


cpu.getHeader();
while (true) {
    let res = prompt(">> ");
    switch (res.toLowerCase()) {
        case "":
        case "fetch": {
            cpu.fetchInst()
            cpu.showRegs();
            break;
        }
        case "show reg":
            cpu.showRegs();
            break;
        case "exit": {
            console.log("All right reserved, peace")
            process.exit();
        }
        case "cls":
        case "clear": {
            console.clear();
            break;
        }
        case "int": {
            //@ts-ignore
            let res1 = prompt("op: ");
            switch (res1) {
                case "show":
                    //@ts-ignore
                    let res2 = prompt("number: ") * 1;
                    cpu.checkInteruption(res2)
                    break;
                case "add": {
                    //@ts-ignore
                    let res2 = prompt("number: ") * 1;
                    cpu.makeInteruption(res2)
                    break;
                }
                case "remove": {
                    //@ts-ignore
                    let res2 = prompt("number: ") * 1;
                    cpu.removeInteruption(res2)
                    break;
                }

                break;

            default:
                console.log("unknown interaption operation")
                break;
            }
            break;
        }
        default:
            console.log(`unknown instruction: "${res}"`);
            break;
    }
}

function logPrograme(tokens: string) {
    let line = ""
    tokens.trim().split("").forEach((letter, i) => {
        line += letter;
        if (line.length == 32 || i == tokens.length - 1) {
            line = line.padEnd(32, "0");
            //@ts-ignore
            let hex = line.match(new RegExp(/.{8}/, "g")).map(d => (("0b" + d) * 1)
                    .toString(16)
                    .toUpperCase()
                    .padStart(2, "0"))
                .join(" ")
            console.log(line + " | " + hex);
            line = "";
        }
    })
}