import * as A from "arcsecond"
import {
    makeType,
    upperOrLower
} from "../tools"
import regs from "./meta"


export let Reg = A.coroutine(function* () {
    let pars = regs.map(reg => upperOrLower(reg));
    let res = yield A.choice(pars)
    yield A.optionalWhitespace
    return makeType("Reg", res)
})