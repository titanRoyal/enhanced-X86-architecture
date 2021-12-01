import * as A from "arcsecond";
import {
  LIT,
  LIT_REG,
  REG_REG,
  LIT_REG_REG,
  LIT_OFF_REG,
  REG_PTR_REG,
  MEM_REG,
  REG_MEM,
  LIT_MEM,
  REG_LIT,
  REG,
  ADR,
  NA,
  STR,
} from "../instTypes";

export let MOV = A.choice([
  LIT_REG_REG("mov", "MOV_LIT_REG_REG"),
  REG_PTR_REG("mov", "MOV_REG_PTR_REG"),
  LIT_OFF_REG("mov", "MOV_REG_OFF_REG"),
  REG_REG("mov", "MOV_REG_REG"),
  LIT_REG("mov", "MOV_LIT_REG"),
  MEM_REG("mov", "MOV_MEM_REG"),
  REG_MEM("mov", "MOV_REG_MEM"),
  LIT_MEM("mov", "MOV_LIT_MEM"),
]);
export let ADD = A.choice([
  REG_REG("add", "ADD_REG_REG"),
  REG_LIT("add", "ADD_REG_LIT"),
]);
export let SUB = A.choice([
  REG_REG("sub", "SUB_REG_REG"),
  LIT_REG("sub", "SUB_LIT_REG"),
  REG_LIT("sub", "SUB_REG_LIT"),
]);

export let DIV = A.choice([
  REG_REG("DIV", "DIV_REG_REG"),
  REG_LIT("DIV", "DIV_REG_LIT"),
  LIT_REG("DIV", "DIV_LIT_REG"),
]);

export let MULT = A.choice([
  REG_REG("MULT", "MULT_REG_REG"),
  REG_LIT("MULT", "MULT_REG_LIT"),
]);
export let MOD = A.choice([
  REG_REG("MOD", "MOD_REG_REG"),
  REG_LIT("MOD", "MOD_REG_LIT"),
  LIT_REG("MOD", "MOD_LIT_REG"),
]);
export let LSH = A.choice([
  REG_REG("lsh", "LSH_REG_REG"),
  LIT_REG("lsh", "LSH_LIT_REG"),
  REG_LIT("lsh", "LSH_REG_LIT"),
]);
export let RSH = A.choice([
  REG_REG("rsh", "RSH_REG_REG"),
  LIT_REG("rsh", "RSH_LIT_REG"),
  REG_LIT("rsh", "RSH_REG_LIT"),
]);

export let AND = A.choice([
  REG_REG("and", "AND_REG_REG"),
  REG_LIT("and", "AND_REG_LIT"),
]);
export let OR = A.choice([
  REG_REG("or", "OR_REG_REG"),
  REG_LIT("or", "OR_REG_LIT"),
]);

export let XOR = A.choice([
  REG_REG("xor", "XOR_REG_REG"),
  REG_LIT("xor", "XOR_REG_LIT"),
]);

export let INC = REG("INC", "INC");

export let DEC = REG("DEC", "DEC");

export let JMP = A.choice([ADR("jmp", "JMP")]);

export let JNE = A.choice([
  REG_MEM("jne", "JNE_REG"),
  LIT_MEM("jne", "JNE_LIT"),
]);

export let JEQ = A.choice([
  REG_MEM("jeq", "JEQ_REG"),
  LIT_MEM("jeq", "JEQ_LIT"),
]);

export let JGT = A.choice([
  REG_MEM("jgt", "JGT_REG"),
  LIT_MEM("jgt", "JGT_LIT"),
]);

export let JGE = A.choice([
  REG_MEM("jge", "JGE_REG"),
  LIT_MEM("jge", "JGE_LIT"),
]);

export let JLT = A.choice([
  REG_MEM("jlt", "JLT_REG"),
  LIT_MEM("jlt", "JLT_LIT"),
]);

export let JLE = A.choice([
  REG_MEM("jle", "JLE_REG"),
  LIT_MEM("jle", "JLE_LIT"),
]);

export let PSH = A.choice([
  REG("psh", "PSH_REG"),
  ADR("psh", "PSH_ADR"),
  LIT("psh", "PSH_LIT"),
]);

export let POP = REG("pop", "POP");

export let CAL = A.choice([
  REG("cal", "CAL_REG"),
  LIT("cal", "CAL_LIT"),
  ADR("cal", "CAL_LIT"),
]);

export let INT = A.choice([LIT("int", "INT_LIT"), REG("int", "INT_REG")]);

export let RTI = NA("rti", "RET_INT");

export let RET = NA("ret", "RET");

export let HLT = NA("hlt", "HLT");

export let WR = A.choice([
  REG("wr", "WR_REG"),
  ADR("wr", "WR_ADR"),
  LIT("wr", "WR_LIT"),
  STR("wr", "WR_STR"),
]);

export let WNL = NA("wnl", "WNL");
