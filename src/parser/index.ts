import * as A from "arcsecond";

import {
  MOV,
  ADD,
  SUB,
  DIV,
  MULT,
  MOD,
  LSH,
  RSH,
  AND,
  OR,
  XOR,
  INC,
  DEC,
  JMP,
  JNE,
  JEQ,
  JGT,
  JGE,
  JLT,
  JLE,
  PSH,
  POP,
  CAL,
  INT,
  RTI,
  RET,
  HLT,
  WR,
  WNL,
} from "./instBody";
import {
  label
} from "./label";
import {
  comment
} from "./comment";
import {
  dataInterface,
  inlineData
} from "./dataStructure";
import {
  ascii
} from "./string";

export default A.many(
  A.choice([
    ascii,
    inlineData,
    dataInterface,
    comment,
    label,
    MOV,
    ADD,
    SUB,
    DIV,
    MULT,
    MOD,
    LSH,
    RSH,
    AND,
    OR,
    XOR,
    INC,
    DEC,
    JMP,
    JNE,
    JEQ,
    JGT,
    JGE,
    JLT,
    JLE,
    PSH,
    POP,
    CAL,
    INT,
    RTI,
    RET,
    HLT,
    WR,
    WNL,
  ])
);