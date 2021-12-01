import * as A from "arcsecond";

import { binDigit, decDigit, hexDigit } from "../primitives";

import { makeType, ValidName } from "../tools";

export let inlineData = A.coroutine(function* () {
  yield A.str("data");
  let type = yield A.choice([A.str("8"), A.str("16"), A.str("32")]);
  yield A.whitespace;
  let name = yield ValidName;
  yield A.optionalWhitespace;
  yield A.char("=");
  yield A.optionalWhitespace;
  yield A.char("{");
  let args = [];
  while (true) {
    yield A.optionalWhitespace;
    let next = yield A.choice([binDigit, hexDigit, decDigit, A.char("}")]);
    if (next == "}") break;
    args.push(next);
    yield A.optionalWhitespace;
    yield A.possibly(A.char(","));
  }
  yield A.optionalWhitespace;
  return makeType("inlineData", type, name, args);
});
export let dataInterface = A.coroutine(function* () {
  yield A.str("interface");
  yield A.whitespace;
  let name = yield ValidName;
  yield A.optionalWhitespace;
  yield A.char("=");
  yield A.optionalWhitespace;
  yield A.char("{");
  let args: any = {};
  while (true) {
    yield A.optionalWhitespace;
    let end = yield A.possibly(A.char("}"));
    if (end) break;
    let subname: any = yield ValidName;
    yield A.char(":");
    let next = yield A.choice([binDigit, hexDigit, decDigit]);
    if (args[subname]) throw "dublicate argument: " + subname;
    args[subname] = next;
    yield A.optionalWhitespace;
    yield A.possibly(A.char(","));
  }
  yield A.optionalWhitespace;
  return makeType("dataInterface", name, args);
});
