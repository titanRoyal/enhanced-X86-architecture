import * as A from "arcsecond";
import {
  Inst,
  Type
} from "../interface";

export function makeType(type: string, ...args: any): Type {
  return {
    type,
    args,
  };
}

export function makeAB(a: any, b: any, op: any) {
  return {
    type: "AB",
    a,
    b,
    op
  };
}

export function makeInstruction(
  inst: string,
  alu: number,
  instType: string,
  group: string,
  args: any
): Inst {
  return {
    inst,
    alu,
    instType,
    group,
    args,
  };
}
export let ValidName = A.regex(/^[a-zA-Z]{1}[a-zA-Z1-9]*/);

export let upperOrLower = (name: string) =>
  A.choice([A.str(name.toLowerCase()), A.str(name.toUpperCase())]);

export function disambiguate(obj: any): any {
  if (obj.length < 2) return obj[0];
  let stages = {
    "*": 2,
    "/": 2,
    "+": 1,
    "-": 1
  };
  let currentStage = -1;
  let currentIndex;
  for (let i = 0; i < obj.length; i++) {
    const element = obj[i];
    if (element.type == "operation") {
      //@ts-ignore
      let stage = stages[element.args[0]];
      if (stage > currentStage) {
        currentIndex = i;
        currentStage = stage;
      }
    }
  }
  if (currentIndex) {
    let first = obj.splice(0, currentIndex);
    let last = obj.splice(0);
    let op = last.shift();
    return makeAB(disambiguate(first), disambiguate(last), op);
  } else {
    return obj[0];
  }
}