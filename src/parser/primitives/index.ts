import * as A from "arcsecond";

import { makeType, ValidName } from "../tools";

export let varDigit = A.coroutine(function* () {
  yield A.char("!");
  let name = yield ValidName;
  yield A.optionalWhitespace;
  return makeType("variable", name);
});

export let adrDigit: any = A.coroutine(function* () {
  yield A.str("&");
  let num = yield A.choice([binDigit, hexDigit, decDigit, nested]);
  return makeType("adrDigit", num);
});

export let binDigit = A.coroutine(function* () {
  yield A.str("0b");
  let num: any = yield A.regex(/^[0-1]+/);
  yield A.optionalWhitespace;
  num = Number("0b" + num);
  return makeType("binDigit", num);
});

export let decDigit = A.coroutine(function* () {
  yield A.str("0c");
  let num: any = yield A.regex(/^[0-9]+/);
  yield A.optionalWhitespace;
  num = Number(num);
  return makeType("decDigit", num);
});

export let hexDigit = A.coroutine(function* () {
  yield A.str("0x");
  let num: any = yield A.regex(/^[0-9A-Fa-f]+/);
  yield A.optionalWhitespace;
  num = Number("0x" + num);
  return makeType("hexDigit", num);
});
export let strDigit = A.coroutine(function* () {
  let res: any = yield A.regex(/^".*"/);
  yield A.optionalWhitespace;
  return makeType("strDigit", res.substr(1, res.length - 2));
});

export let brakets: any = A.coroutine(function* () {
  yield A.char("(");
  yield A.optionalWhitespace;
  let args = [];
  args.push(yield A.choice([adrDigit, binDigit, decDigit, hexDigit, brakets]));
  while (true) {
    yield A.optionalWhitespace;
    let op = yield A.choice([
      A.char("*"),
      A.char("+"),
      A.char("-"),
      A.char("/"),
      A.char(")"),
    ]);
    yield A.optionalWhitespace;
    if (op == ")") {
      break;
    }
    args.push(makeType("operation", op));
    args.push(
      yield A.choice([
        adrDigit,
        binDigit,
        decDigit,
        hexDigit,
        brakets,
        varDigit,
      ])
    );
  }
  yield A.optionalWhitespace;
  return makeType("braket", args);
});

export let nested = A.coroutine(function* () {
  yield A.char("[");
  let args = [];
  while (true) {
    yield A.optionalWhitespace;
    let res = yield A.choice([
      brakets,
      adrDigit,
      binDigit,
      decDigit,
      hexDigit,
      varDigit,
      A.char("]"),
    ]);
    yield A.optionalWhitespace;
    if (res == "]") {
      break;
    }
    args.push(res);
    let op = yield A.choice([
      A.char("*"),
      A.char("+"),
      A.char("-"),
      A.char("/"),
      A.char(")"),
      A.char("]"),
    ]);
    if (op == "]") {
      break;
    }
    let res1 = yield A.choice([
      brakets,
      adrDigit,
      binDigit,
      decDigit,
      hexDigit,
      varDigit,
    ]);
    yield A.optionalWhitespace;
    args.push(makeType("operation", op), res1);
  }
  yield A.optionalWhitespace;
  return makeType("nested", args);
});
