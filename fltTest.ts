import {
    decodeRegisterFloat
} from "./src/VM/float";

let num = Number("0b11000000000100110011001100110010")

let res = decodeRegisterFloat(num)
console.log(res)