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
import * as path from "path"


let prompt = ps();
let root = process.argv[2];
if (!root) {
    console.log("please specify a target file.")
    process.exit;
}
root = path.join(__dirname, root);
if (!fs.existsSync(root)) {
    console.log("file does not exist: " + root);
    process.exit();
}
let txt = fs.readFileSync(root, "utf-8");

let asm = new Assembler();

// let tokens = asm.generateBits(txt);

// logPrograme(tokens);
let mem = new Memory(0xffffff);
let cpu = new CPU(mem);



let offset = 0;
while (true) {
    let prog = asm.generateBits(txt, offset);
    let memOffset = mem.alloc(prog.length)
    let newProg = asm.generateBits(txt, memOffset);
    // console.log(prog.length, offset, newProg.length, memOffset)
    if (prog.length == newProg.length) {
        mem.injectCode(memOffset, newProg)
        cpu.SetRegister("IP", memOffset);
        logPrograme(newProg);
        break;
    } else offset = memOffset;
}
let intVec = makeIntVector(mem);
let intOffset = mem.alloc(intVec.length);
mem.injectCode(intOffset, intVec);
cpu.intVector = intOffset;
// mem.injectCode(0, tokens);
// mem.injectCode(0x3000, )


cpu.getHeader();
while (true) {
    let res = prompt(">> ").trim();
    switch (res.toLowerCase()) {
        case "":
        case "fetch": {
            cpu.fetchInst()
            // cpu.showRegs()
            break;
        }
        case "exec": {
            try {
                while (true) {
                    cpu.fetchInst();
                }
            } catch (error) {
                console.log(error)
                process.exit();
            }
        }
        case "show reg":
            cpu.showRegs();
            break;
        case "exit": {
            console.log("");
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
            //@ts-ignore
            // let letter = line.match(new RegExp(/.{8}/, "g")).map(d => {
            //     //@ts-ignore
            //     let res = (("0b" + d) * 1);
            //     if (res > 255) return "."
            //     else return String.fromCharCode(res);
            // })
            console.log(line + " | " + hex);
            line = "";
        }
    })
}