import * as A from "arcsecond"
import {
    makeType,
    ValidName
} from "../tools"

export let label = A.coroutine(function* () {
    let name = yield ValidName;
    yield A.char(":")
    yield A.optionalWhitespace
    return makeType("label", name);
})