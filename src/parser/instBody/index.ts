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
  MEM_REG("mov", "MOV_MEM_REG", 7),
  LIT_REG_REG("mov", "MOV_LIT_REG_REG", 7),
  REG_PTR_REG("mov", "MOV_REG_PTR_REG", 7),
  LIT_OFF_REG("mov", "MOV_REG_OFF_REG", 7),
  REG_REG("mov", "MOV_REG_REG", 7),
  LIT_REG("mov", "MOV_LIT_REG", 7),
  REG_MEM("mov", "MOV_REG_MEM", 7),
  LIT_MEM("mov", "MOV_LIT_MEM", 7),
]);
export let ADD = A.choice([
  REG_REG("add", "ADD_REG_REG", 2),
  REG_LIT("add", "ADD_REG_LIT", 2),
]);
export let SUB = A.choice([
  REG_REG("sub", "SUB_REG_REG", 2),
  LIT_REG("sub", "SUB_LIT_REG", 2),
  REG_LIT("sub", "SUB_REG_LIT", 2),
]);

export let DIV = A.choice([
  REG_REG("DIV", "DIV_REG_REG", 2),
  REG_LIT("DIV", "DIV_REG_LIT", 2),
  LIT_REG("DIV", "DIV_LIT_REG", 2),
]);

export let MULT = A.choice([
  REG_REG("MULT", "MULT_REG_REG", 2),
  REG_LIT("MULT", "MULT_REG_LIT", 2),
]);
export let MOD = A.choice([
  REG_REG("MOD", "MOD_REG_REG", 2),
  REG_LIT("MOD", "MOD_REG_LIT", 2),
  LIT_REG("MOD", "MOD_LIT_REG", 2),
]);

export let INC = REG("INC", "INC", 2);

export let DEC = REG("DEC", "DEC", 2);

export let LSH = A.choice([
  REG_REG("lsh", "LSH_REG_REG", 1),
  LIT_REG("lsh", "LSH_LIT_REG", 1),
  REG_LIT("lsh", "LSH_REG_LIT", 1),
]);
export let RSH = A.choice([
  REG_REG("rsh", "RSH_REG_REG", 1),
  LIT_REG("rsh", "RSH_LIT_REG", 1),
  REG_LIT("rsh", "RSH_REG_LIT", 1),
]);
export let AND = A.choice([
  REG_REG("and", "AND_REG_REG", 1),
  REG_LIT("and", "AND_REG_LIT", 1),
]);
export let OR = A.choice([
  REG_REG("or", "OR_REG_REG", 1),
  REG_LIT("or", "OR_REG_LIT", 1),
]);
export let XOR = A.choice([
  REG_REG("xor", "XOR_REG_REG", 1),
  REG_LIT("xor", "XOR_REG_LIT", 1),
]);
export let NOT = A.choice([
  REG("not", "NOT_REG", 1),
  LIT("not", "NOT_LIT", 1)
])


export let JMP = A.choice([ADR("jmp", "JMP", 5)]);

export let JNE = A.choice([
  REG_MEM("jne", "JNE_REG", 5),
  LIT_MEM("jne", "JNE_LIT", 5),
]);

export let JEQ = A.choice([
  REG_MEM("jeq", "JEQ_REG", 5),
  LIT_MEM("jeq", "JEQ_LIT", 5),
]);

export let JGT = A.choice([
  REG_MEM("jgt", "JGT_REG", 5),
  LIT_MEM("jgt", "JGT_LIT", 5),
]);

export let JGE = A.choice([
  REG_MEM("jge", "JGE_REG", 5),
  LIT_MEM("jge", "JGE_LIT", 5),
]);

export let JLT = A.choice([
  REG_MEM("jlt", "JLT_REG", 5),
  LIT_MEM("jlt", "JLT_LIT", 5),
]);

export let JLE = A.choice([
  REG_MEM("jle", "JLE_REG", 5),
  LIT_MEM("jle", "JLE_LIT", 5),
]);

export let PSH = A.choice([
  REG("psh", "PSH_REG", 3),
  ADR("psh", "PSH_ADR", 3),
  LIT("psh", "PSH_LIT", 3),
]);

export let POP = REG("pop", "POP", 3);

export let CAL = A.choice([
  REG("cal", "CAL_REG", 6),
  LIT("cal", "CAL_LIT", 6),
  ADR("cal", "CAL_LIT", 6),
]);

export let INT = A.choice([
  LIT("int", "INT_LIT", 8),
  REG("int", "INT_REG", 8)
]);

export let RTI = NA("rti", "RET_INT", 8);

export let RET = NA("ret", "RET", 6);

export let HLT = NA("hlt", "HLT", 5);

export let WR = A.choice([
  REG("wr", "WR_REG", 9),
  ADR("wr", "WR_ADR", 9),
  LIT("wr", "WR_LIT", 9),
  // STR("wr", "WR_STR", 9),
]);
export let INP = A.choice([
  REG("INP", "INP_REG", 9),
]);

export let WNL = NA("wnl", "WNL", 9);