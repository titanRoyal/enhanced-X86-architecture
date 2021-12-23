import MemoryInt from "./interface";
import regMap from "../assembler/regMap";
import instMap from "../instMeta/inst"
import typeMap from "../instMeta/type"
import aluMap from "./ALUMap"
import flagMap from "./flagMap"
import {
    Memory
} from "./Memory";
import {
    arethmeticALU,
    bitwiseALU,
    branchALU,
    fnCalALU,
    interuptionALU,
    IOALU,
    movALU,
    stackALU,
    structALU
} from "./ALU";
import * as Float from "./float";
import * as Signed from "./signed"

export default class CPU {
    idBits: number;
    MaxLength: number;
    bitBlock: number;
    adrOffset: number;
    Mapper: MemoryInt;
    regSize: number;
    regOffset: any;
    regValue: MemoryInt
    flagValue: MemoryInt
    VT: any;
    intVector: number;
    outputStream: string;
    maxFlagLength: number;
    constructor(mapper: MemoryInt, intVector = 0x3000) {
        // console.log("cpu int Vector: " + intVector)
        this.idBits = 3;
        this.bitBlock = 8;
        this.MaxLength = 32;
        this.maxFlagLength = Object.keys(flagMap).length;
        this.adrOffset = 5;
        this.Mapper = mapper
        this.regSize = 32;
        this.intVector = intVector;
        this.outputStream = "";
        this.regOffset = Object.keys(regMap).reduce((acc, curr, i) => {
            //@ts-ignore
            if (curr != "max") acc[curr] = i;
            return acc;

        }, {})
        this.regValue = new Memory(this.regSize * Object.keys(regMap).length - 1)
        this.flagValue = new Memory(this.maxFlagLength * Object.keys(regMap).length - 1)
        this.VT = null;
        this.SetRegister("sp", this.Mapper.size - this.MaxLength);
    }
    makeInteruption(pos: number) {
        let value = Math.pow(2, pos);
        let im = this.getRegister("IM") as number;
        this.SetRegister("IM", im | value);
    }
    removeInteruption(pos: number) {
        //@ts-ignore
        let value = (("0b" + "1".repeat(this.MaxLength)) * 1) - Math.pow(2, pos);
        let im = this.getRegister("IM") as number;
        this.SetRegister("IM", im & value);
    }
    checkInteruption(pos: number) {
        let value = Math.pow(2, pos) as number;
        //@ts-ignore
        let res = (this.getRegister("IM") & value) >> pos;
        return Boolean(res);
    }
    push(val: number) {
        let sp = this.getRegister("sp") as number;
        this.SetRegister("sp", sp - this.MaxLength);
        this.Mapper.setbit32(sp - this.MaxLength as number, val);
    }
    pushFrame() {
        Object.keys(regMap).forEach((curr, i) => {
            if (curr == "max" || curr == "DATA") return;
            this.push(this.getRegister(curr) as number);
        })
        this.SetRegister("fp", this.getRegister("sp") as number);
    }
    popFrame() {
        this.SetRegister("sp", this.getRegister("fp") as number);
        Object.keys(regMap).reverse().forEach((curr, i) => {
            if (curr == "max" || curr == "DATA") return;
            this.SetRegister(curr, this.pop() as number)
        })
    }
    pop() {
        let sp = this.getRegister("sp") as number;
        let res = this.Mapper.getbit32(sp)
        this.SetRegister("sp", sp + this.MaxLength);
        return res;
    }
    getRegister(regName: string, isString = false): string | number {
        regName = regName.toUpperCase();
        if (this.regOffset[regName] == undefined) throw `Sorry this register does not exist: "${regName}"`;
        if (isString) {
            return this.regValue.getNbit(this.regOffset[regName] * this.regSize, this.regSize, isString);
        }
        let val = this.regValue.getNbit(this.regOffset[regName] * this.regSize, this.regSize) as number;
        let FF = this.getFlag(regName, false, "FF");
        let SF = this.getFlag(regName, false, "SF");
        if (FF) {
            return Float.decodeRegisterFloat(val);
        } else if (SF) {
            return Signed.decodeRegisterSigned(val);
        }
        return val;
    }
    getFlag(regName: string, isString = false, flagName ? : string) {
        regName = regName.toUpperCase();
        if (this.regOffset[regName] == undefined) throw `Sorry this register does not exist: "${regName}"`;
        if (!flagName) {
            return this.flagValue.getNbit(this.regOffset[regName] * this.maxFlagLength, this.maxFlagLength, isString);
        } else {
            flagName = flagName.toUpperCase();
            //@ts-ignore
            if (flagMap[flagName] == undefined) throw `Sorry this Flag does not exist: "${flagName}"`;
            //@ts-ignore
            return this.flagValue.getNbit(this.regOffset[regName] * this.maxFlagLength + flagMap[flagName], 1, isString);
        }
    }
    SetFlag(regName: string, flagName: string, value: boolean) {
        if (this.regOffset[regName] == undefined) throw `Sorry this register does not exist: "${regName}"`;
        //@ts-ignore
        if (flagMap[flagName] == undefined) throw `Sorry this Flag does not exist: "${flagName}"`;
        //@ts-ignore
        this.flagValue.setNbit(this.regOffset[regName] * this.maxFlagLength + flagMap[flagName], (value) ? 1 : 0, 1);
    }
    SetRegister(regName: string, regValue: number) {
        let val: number | string = regValue;
        regName = regName.toLocaleUpperCase();
        if (this.regOffset[regName] == undefined) throw `Sorry this register does not exist: "${regName}"`;
        if (val != Math.floor(val)) {
            val = Float.makeRegisterFloat(regValue);
        } else if (val < 0) {
            //TODO: fix the signed class
            val = Signed.makeRegisterSigned(regValue);

        }
        this.regValue.setNbit(this.regOffset[regName] * this.regSize, val, this.regSize);
        this.handleFlags(regName, regValue);
    }
    handleFlags(regName: string, regValue: number) {
        let pair = (regValue.toString(2).split("").filter(d => d == "1").length % 2 + ((regValue < 0) ? 1 : 0) == 0) ? "1" : "0"
        let float = (regValue == Math.floor(regValue)) ? "0" : "1"
        let sign;
        if (float == "1") sign = "0";
        else sign = (regValue < 0) ? "1" : "0";
        let overflow = (regValue >= Math.pow(2, 32)) ? "1" : "0";
        let value = Number("0b" + pair + float + sign + overflow)
        this.flagValue.setNbit(this.regOffset[regName] * this.maxFlagLength, value, this.maxFlagLength);
    }
    getNbit(size: number, isString = false) {
        let ip = this.getRegister("IP") as number;
        if (ip >= this.Mapper.size) throw "ip pointer out of range";
        this.SetRegister("IP", ip + size);
        return this.Mapper.getNbit(ip, size, isString);
    }

    getHeader() {
        let status = this.getNbit(1);
        if (status) {
            let InstructionSequence = (this.getNbit(8, true) as string).split("").map((data, index) => (data == "1") ? (index + 1) : null).filter(data => data != null);
            let virtualTable = []
            while (true) {
                let inst = this.getNbit(instMap.max, true);
                //@ts-ignore
                if (("0b" + inst) * 1 != 0) {
                    virtualTable.push(inst);
                } else {
                    break;
                }
            }
            let vt = this.makeVirtualTable(InstructionSequence, virtualTable);
            this.VT = vt;
            //@ts-ignore
            this.VT.max = Math.max(...Object.keys(this.VT).map(d => d.length))
        } else {
            console.log("NO BIS")
        }

    }
    makeVirtualTable(levels: any, vt: any) {
        let tab = {}
        levels.forEach((data: any, index: number) => {
            let last = (index == levels.length - 1) ? "" : "0"
            for (let i = 0; i < Math.pow(2, data); i++) {
                let number = i.toString(2).padStart(data, "0") + last;
                for (let i1 = 0; i1 < index; i1++) {
                    number = this.insertStr(number, levels[i1] + i1, "1")
                }
                if (vt.length > 0) {
                    //@ts-ignore
                    tab[number] = vt.shift();
                }
            }
        })
        return tab;
    }
    insertStr(str: string, pos: number, fill: string) {
        let upper = str.substr(0, pos)
        let lower = str.substr(pos);
        return upper + fill + lower
    }
    fetchInst() {
        let opCode = this.getOpCode();
        let opType = this.getOpType();
        let opArgs = this.getOpArgs(opType);
        opType = opType.split("_").map(d => {
            if (d.length == 1) return d;
            return d[1];
        }).join("_")
        console.log(opType)
        let alu = this.getOpALU(opCode)
        console.log(opCode, opType, opArgs);
        this.ALUProcess(opCode, opType, opArgs, alu);
    }
    ALUProcess(opcode: string, type: string, args: any, alu: number) {
        if (opcode == "HLT") {
            console.log("All right reserved, peace")
            process.exit();
        }
        switch (alu) {
            case 0x1:
                bitwiseALU(this, opcode, type, args);
                break;
            case 0x2:
                arethmeticALU(this, opcode, type, args);
                break;
            case 0x3:
                stackALU(this, opcode, type, args);
                break;
            case 0x4:

                structALU(this, opcode, type, args);
                break;
            case 0x5:
                branchALU(this, opcode, type, args);
                break;
            case 0x6:
                fnCalALU(this, opcode, type, args);
                break;
            case 0x7:
                movALU(this, opcode, type, args);
                break;
            case 0x8:
                interuptionALU(this, opcode, type, args);
                break;
            case 0x9:
                IOALU(this, opcode, type, args);
                break;

            default:
                throw `Unknown ALU :"${alu}"`
        }
    }
    getOpALU(opCode: string) {
        for (const key in aluMap) {
            //@ts-ignore
            let alu = aluMap[key];
            if (alu[opCode]) return alu.aluNumber;
        }

        throw `this opCode does not  belong to ALU: "${opCode}"`
    }
    getOpArgs(optype: string) {
        let args = []
        switch (optype) {
            case "L_R": {
                let arg1 = this.fetchLiteral();
                let arg2 = this.fetchRegister();
                args.push(arg1, arg2)
                break;
            }
            case "SL_R": {
                let arg1 = this.fetchLiteral("S");
                let arg2 = this.fetchRegister();
                args.push(arg1, arg2)
                break;
            }
            case "FL_R": {
                let arg1 = this.fetchLiteral("F");
                let arg2 = this.fetchRegister();
                args.push(arg1, arg2)
                break;
            }
            case "R_L": {
                let arg1 = this.fetchRegister()
                let arg2 = this.fetchLiteral();
                args.push(arg1, arg2)
                break;
            }
            case "R_R": {
                let arg1 = this.fetchRegister()
                let arg2 = this.fetchRegister();
                args.push(arg1, arg2)
                break;
            }
            case "R_M": {
                let arg1 = this.fetchRegister()
                let arg2 = this.fetchAddress();
                args.push(arg1, arg2)
                break;
            }
            case "M_R": {
                let arg1 = this.fetchAddress();
                let arg2 = this.fetchRegister();
                args.push(arg1, arg2)
                break;
            }
            case "L_M": {
                let arg1 = this.fetchLiteral();
                let arg2 = this.fetchAddress();
                args.push(arg1, arg2)
                break;
            }
            case "R_P_R": {
                let arg1 = this.fetchRegister()
                let arg2 = this.fetchAddress();
                let arg3 = this.fetchRegister()
                args.push(arg1, arg2, arg3)
                break;
            }
            case "L_O_R": {
                let arg1 = this.fetchLiteral()
                let arg2 = this.fetchRegister();
                args.push(arg1, arg2)
                break;
            }
            case "R": {
                let arg1 = this.fetchRegister();
                args.push(arg1)
                break;
            }
            case "L": {
                let arg1 = this.fetchLiteral();
                args.push(arg1)
                break;
            }
            case "M": {
                let arg1 = this.fetchAddress();
                args.push(arg1)
                break;
            }
            case "NA": {
                break;
            }

            default:
                throw `unknown type : "${optype}"`
        }
        return args;
    }
    getOpType(): string {
        let typeSize = typeMap.max;
        let type = this.getNbit(typeSize, true);
        let found = "";
        for (const key in typeMap) {
            //@ts-ignore
            if (typeMap[key] == type) {
                found = key;
                break;
            }
        }
        return found;
    }
    getOpCode(): string {
        if (this.VT) {
            let code = ""
            var inst;
            while (code.length <= this.VT.max) {
                code += this.getNbit(1);
                if (code in this.VT) {
                    inst = this.VT[code];
                    break;
                }
            }
            if (!inst) throw "unknown instruction in the VT table " + code;
        } else {
            let instSize = instMap.max;
            //@ts-ignore
            var inst = this.getNbit(instSize, true);
        }
        let found = "";
        for (const key in instMap) {
            //@ts-ignore
            if (instMap[key] == inst) {
                found = key;
                break;
            }

        }
        return found;
    }
    fetchRegister() {
        let regSize = regMap.max;
        let reg = this.getNbit(regSize, true);
        let found = "";
        for (const key in regMap) {
            //@ts-ignore
            if (regMap[key] == reg) {
                found = key;
                break;
            }
        }
        return found;
    }
    fetchLiteral(type = "NA", isString = false): number | string {
        let size = (this.getNbit(this.idBits) as number) + 1;
        if (isString || type == "NA") return this.getNbit(size * this.bitBlock, isString);
        if (type == "F") return Float.decodeMemoryFloat(this.getNbit(size * this.bitBlock, isString) as number);
        if (type == "S") return Signed.decodeMemorySigned(this.getNbit(size * this.bitBlock, isString) as number);
        throw "can't handle this literal";
    }
    fetchAddress(isString = false) {
        let res = this.fetchLiteral("NA", true) as string;
        if (isString) return res;
        //@ts-ignore
        let word = ("0b" + res.substr(0, res.length - this.adrOffset)) * 1
        //@ts-ignore
        let offset = ("0b" + res.substr(res.length - this.adrOffset)) * 1
        return word * this.MaxLength + offset;
    }
    showRegs() {
        Object.keys(regMap).forEach((curr, i) => {
            if (curr == "max") return;
            let value = this.getRegister(curr, true) as string
            let flag = this.getFlag(curr, true);
            //@ts-ignore
            let hex = value.match(new RegExp(/.{8}/, "g")).map(d => (("0b" + d) * 1)
                    .toString(16)
                    .toUpperCase()
                    .padStart(2, "0"))
                .join(" ")
            console.log(`${curr.padEnd(5," ")}: ${value} | ${flag} | ${hex}`);
        }, {})
    }
}