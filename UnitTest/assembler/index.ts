import { Assembler } from "../../src/assembler";

import fs from "fs";
let asm = new Assembler();

let input = fs.readFileSync("../input.asm", "utf-8");

let res = asm.generateBits(input);

Assembler.showCode(res);

console.log("hello world");
