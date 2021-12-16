import {
    Assembler
} from "../../src/assembler";

import CPU from "../../src/VM/cpu";

import {
    Memory
} from "../../src/VM/Memory";

import fs from "fs"

import ps from "prompt-sync"


let prompt = ps();

let txt = fs.readFileSync("../input.asm", "utf-8");

let asm = new Assembler();

let tokens = asm.generateBits(txt);

logPrograme(tokens);


let mem = new Memory(0xffffff);




mem.injectCode(0, tokens);

let cpu = new CPU(mem);

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
        default:
            console.log(`unknown instruction: "${res}"`);
            break;
    }
}
// cpu.SetRegister("R1", 10)
// cpu.SetRegister("R2", (cpu.getRegister("R1") as number) + 20)
// console.log(cpu.getRegister("R1"))
// console.log(cpu.getRegister("R1", true))
// console.log(cpu.getRegister("R2"))
// console.log(cpu.getRegister("R2", true))
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