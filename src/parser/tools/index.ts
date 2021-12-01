import * as A from "arcsecond";
import { Inst, Type } from "../interface";

export function makeType(type: string, ...args: any): Type {
  return {
    type,
    args,
  };
}

export function makeInstruction(
  inst: string,
  instType: string,
  group: string,
  args: any
): Inst {
  return {
    inst,
    instType,
    group,
    args,
  };
}
export let ValidName = A.regex(/^[a-zA-Z]{1}[a-zA-Z1-9]*/);

export let upperOrLower = (name: string) =>
  A.choice([A.str(name.toLowerCase()), A.str(name.toUpperCase())]);
