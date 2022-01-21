import * as A from "arcsecond";

import {
  nested,
  binDigit,
  decDigit,
  hexDigit,
  adrDigit,
  strDigit,
} from "../primitives";

import { Reg } from "../Register";

import { makeInstruction, upperOrLower } from "../tools";

let lit = A.coroutine(function* () {
  // let type = yield A.possibly(A.choice([upperOrLower("f"), upperOrLower("s")]))
  let sign = yield A.possibly(A.char("-"));
  let num = yield A.choice([nested, binDigit, decDigit, hexDigit]);
  //@ts-ignore
  // if (type) num.categorie = type.toUpperCase();
  if (num.type == "variable" || num.type == "AB") return num;
  //@ts-ignore
  num.args[0] *= sign ? -1 : 1;
  return num;
});

export let LIT_REG_LIT = (inst: string, group: string, alu: number) => {
  return A.coroutine(function* () {
    yield upperOrLower(inst);
    yield A.optionalWhitespace;
    let litt = yield lit;
    yield A.optionalWhitespace;
    yield A.str(",");
    yield A.optionalWhitespace;
    let regg = yield Reg;
    yield A.optionalWhitespace;
    yield A.str(",");
    yield A.optionalWhitespace;
    let litt1 = yield lit;
    yield A.optionalWhitespace;
    return makeInstruction(inst, alu, "L_R_L", group, [litt, regg, litt1]);
  });
};
export let REG_REG_LIT = (inst: string, group: string, alu: number) => {
  return A.coroutine(function* () {
    yield upperOrLower(inst);
    yield A.optionalWhitespace;
    let reggg = yield Reg;
    yield A.optionalWhitespace;
    yield A.str(",");
    yield A.optionalWhitespace;
    let regg = yield Reg;
    yield A.optionalWhitespace;
    yield A.str(",");
    yield A.optionalWhitespace;
    let litt1 = yield lit;
    yield A.optionalWhitespace;
    return makeInstruction(inst, alu, "R_R_L", group, [reggg, regg, litt1]);
  });
};
export let REG_LIT_REG = (inst: string, group: string, alu: number) => {
  return A.coroutine(function* () {
    yield upperOrLower(inst);
    yield A.optionalWhitespace;
    let reg = yield Reg;
    yield A.optionalWhitespace;
    yield A.str(",");
    yield A.optionalWhitespace;
    let litt = yield lit;
    yield A.optionalWhitespace;
    yield A.str(",");
    yield A.optionalWhitespace;
    let reg1 = yield Reg;
    yield A.optionalWhitespace;
    return makeInstruction(inst, alu, "R_L_R", group, [reg, litt, reg1]);
  });
};

export let LIT = function (inst: string, group: string, alu: number) {
  return A.coroutine(function* () {
    yield upperOrLower(inst);
    yield A.whitespace;
    let args = yield lit;
    return makeInstruction(inst, alu, "L", group, [args]);
  });
};

export let REG = function (inst: string, group: string, alu: number) {
  return A.coroutine(function* () {
    yield upperOrLower(inst);
    yield A.whitespace;
    let args: any = yield Reg;
    return makeInstruction(inst, alu, "R", group, [args]);
  });
};

export let ADR = function (inst: string, group: string, alu: number) {
  return A.coroutine(function* () {
    yield upperOrLower(inst);
    yield A.whitespace;
    let args: any = yield adrDigit;
    return makeInstruction(inst, alu, "M", group, [args]);
  });
};

export let STR = function (inst: string, group: string, alu: number) {
  return A.coroutine(function* () {
    yield upperOrLower(inst);
    yield A.whitespace;
    let args: any = yield strDigit;
    return makeInstruction(inst, alu, "STR", group, [args]);
  });
};

export let LIT_REG = function (inst: string, group: string, alu: number) {
  return A.coroutine(function* () {
    yield upperOrLower(inst);
    yield A.whitespace;
    let litt: any = yield lit;
    yield A.optionalWhitespace;
    yield A.char(",");
    yield A.optionalWhitespace;
    let reg: any = yield Reg;
    return makeInstruction(inst, alu, "L_R", group, [litt, reg]);
  });
};
export let REG_LIT = function (inst: string, group: string, alu: number) {
  return A.coroutine(function* () {
    yield upperOrLower(inst);
    yield A.whitespace;
    let reg: any = yield Reg;
    yield A.optionalWhitespace;
    yield A.char(",");
    yield A.optionalWhitespace;
    let litt: any = yield lit;
    return makeInstruction(inst, alu, "R_L", group, [reg, litt]);
  });
};
export let REG_REG = function (inst: string, group: string, alu: number) {
  return A.coroutine(function* () {
    yield upperOrLower(inst);
    yield A.whitespace;
    let reg: any = yield Reg;
    yield A.optionalWhitespace;
    yield A.char(",");
    yield A.optionalWhitespace;
    let reg1 = yield Reg;
    return makeInstruction(inst, alu, "R_R", group, [reg, reg1]);
  });
};

export let REG_MEM = (inst: string, group: string, alu: number) => {
  return A.coroutine(function* () {
    yield upperOrLower(inst);
    yield A.optionalWhitespace;
    let r1 = yield Reg;
    yield A.optionalWhitespace;
    yield A.str(",");
    yield A.optionalWhitespace;
    let MEM = yield adrDigit;
    yield A.optionalWhitespace;
    return makeInstruction(inst, alu, "R_M", group, [r1, MEM]);
  });
};

export let MEM_REG = (inst: string, group: string, alu: number) => {
  return A.coroutine(function* () {
    yield upperOrLower(inst);
    yield A.optionalWhitespace;
    let MEM = yield adrDigit;
    yield A.optionalWhitespace;
    yield A.str(",");
    yield A.optionalWhitespace;
    let r1 = yield Reg;
    yield A.optionalWhitespace;
    return makeInstruction(inst, alu, "M_R", group, [MEM, r1]);
  });
};

export let LIT_MEM = (inst: string, group: string, alu: number) => {
  return A.coroutine(function* () {
    yield upperOrLower(inst);
    yield A.optionalWhitespace;
    let litt = yield lit;
    yield A.optionalWhitespace;
    yield A.str(",");
    yield A.optionalWhitespace;
    let MEM = yield adrDigit;
    yield A.optionalWhitespace;
    return makeInstruction(inst, alu, "L_M", group, [litt, MEM]);
  });
};

export let NA = (inst: string, group: string, alu: number) => {
  return A.coroutine(function* () {
    yield upperOrLower(inst);
    yield A.optionalWhitespace;
    return makeInstruction(inst, alu, "NA", group, []);
  });
};
