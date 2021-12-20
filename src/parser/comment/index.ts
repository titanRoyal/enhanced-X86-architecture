import * as A from "arcsecond";
import { makeType } from "../tools";

export let comment = A.coroutine(function* () {
  let name = yield A.regex(/^;.*/);
  yield A.optionalWhitespace;
  return makeType("comment", name);
});
