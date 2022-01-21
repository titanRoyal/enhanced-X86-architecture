import { MakeHeader } from "../../src/instMeta/makeInstruction";

let state = { CAL: 3, MOV: 1, INC: 1, HLT: 1, ADD: 2, RET: 2 };
let res = MakeHeader(state);
console.log(res);
