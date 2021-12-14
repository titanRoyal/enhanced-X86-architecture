import * as A from "arcsecond";

import {
  nested,
  binDigit,
  decDigit,
  hexDigit,
  adrDigit,
  strDigit,
} from "../primitives";

import {
  Reg
} from "../Register";

import {
  makeInstruction,
  upperOrLower
} from "../tools";

let lit = A.choice([nested, binDigit, decDigit, hexDigit]);

export let LIT = function (inst: string, group: string, alu: number) {
  let res: any = A.coroutine(function* () {
    yield upperOrLower(inst);
    yield A.whitespace;
    let args = yield lit;
    return makeInstruction(inst, alu, "L", group, [args]);
  });
  return res;
};

export let REG = function (inst: string, group: string, alu: number) {
  let res = A.coroutine(function* () {
    yield upperOrLower(inst);
    yield A.whitespace;
    let args: any = yield Reg;
    return makeInstruction(inst, alu, "R", group, [args]);
  });
  return res;
};

export let ADR = function (inst: string, group: string, alu: number) {
  let res = A.coroutine(function* () {
    yield upperOrLower(inst);
    yield A.whitespace;
    let args: any = yield adrDigit;
    return makeInstruction(inst, alu, "M", group, [args]);
  });
  return res;
};

export let STR = function (inst: string, group: string, alu: number) {
  let res = A.coroutine(function* () {
    yield upperOrLower(inst);
    yield A.whitespace;
    let args: any = yield strDigit;
    return makeInstruction(inst, alu, "STR", group, [args]);
  });
  return res;
};

export let LIT_REG = function (inst: string, group: string, alu: number) {
  let res = A.coroutine(function* () {
    yield upperOrLower(inst);
    yield A.whitespace;
    let litt: any = yield lit;
    yield A.optionalWhitespace;
    yield A.char(",");
    yield A.optionalWhitespace;
    let reg: any = yield Reg;
    return makeInstruction(inst, alu, "L_R", group, [litt, reg]);
  });
  return res;
};
export let REG_LIT = function (inst: string, group: string, alu: number) {
  let res = A.coroutine(function* () {
    yield upperOrLower(inst);
    yield A.whitespace;
    let reg: any = yield Reg;
    yield A.optionalWhitespace;
    yield A.char(",");
    yield A.optionalWhitespace;
    let litt: any = yield lit;
    return makeInstruction(inst, alu, "R_L", group, [litt, reg]);
  });
  return res;
};
export let REG_REG = function (inst: string, group: string, alu: number) {
  let res = A.coroutine(function* () {
    yield upperOrLower(inst);
    yield A.whitespace;
    let reg: any = yield Reg;
    yield A.optionalWhitespace;
    yield A.char(",");
    yield A.optionalWhitespace;
    let reg1 = yield Reg;
    return makeInstruction(inst, alu, "R_R", group, [reg, reg1]);
  });
  return res;
};

export let LIT_REG_REG = (inst: string, group: string, alu: number) => {
  return A.coroutine(function* () {
    yield upperOrLower(inst);
    yield A.optionalWhitespace;
    let litt = yield lit;
    yield A.optionalWhitespace;
    yield A.str(",");
    yield A.optionalWhitespace;
    let reg = yield Reg;
    yield A.optionalWhitespace;
    yield A.str(",");
    yield A.optionalWhitespace;
    let reg1 = yield Reg;
    return makeInstruction(inst, alu, "L_R_R", group, [litt, reg, reg1]);
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

export let REG_PTR_REG = (inst: string, group: string, alu: number) => {
  return A.coroutine(function* () {
    yield upperOrLower(inst);
    yield A.optionalWhitespace;
    let r1 = yield A.str("&").chain(() => Reg);
    yield A.optionalWhitespace;
    yield A.str(",");
    yield A.optionalWhitespace;
    let r2 = yield Reg;
    yield A.optionalWhitespace;
    return makeInstruction(inst, alu, "R_M_R", group, [r1, r2]);
  });
};
export let LIT_OFF_REG = (inst: string, group: string, alu: number) => {
  return A.coroutine(function* () {
    yield upperOrLower(inst);
    yield A.optionalWhitespace;
    let litt = yield lit;
    yield A.optionalWhitespace;
    yield A.str(",");
    yield A.optionalWhitespace;
    let r1 = yield A.str("&").chain(() => Reg);
    yield A.optionalWhitespace;
    yield A.str(",");
    yield A.optionalWhitespace;
    let r2 = yield Reg;
    yield A.optionalWhitespace;
    return makeInstruction(inst, alu, "L_M_R", group, [litt, r1, r2]);
  });
};

export let NA = (inst: string, group: string, alu: number) => {
  return A.coroutine(function* () {
    yield upperOrLower(inst);
    yield A.optionalWhitespace;
    return makeInstruction(inst, alu, "NA", group, []);
  });
};