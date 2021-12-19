import * as A from "arcsecond"
import {
    makeType,
    ValidName
} from "../tools"



export let ascii = A.coroutine(function* () {
    yield A.str("ascii")
    yield A.whitespace
    let name = yield ValidName;
    yield A.optionalWhitespace;
    yield A.char("=")
    yield A.optionalWhitespace;
    let str = yield A.regex(/^".*"/)
    yield A.optionalWhitespace

    return makeType("ascii", name, str);

})