import Parser from "../parser";

import regMap from "./regMap";

import instOpCode from "../instMeta/inst";

import instType from "../instMeta/type";

import { MakeHeader } from "../instMeta/makeInstruction";
import * as Float from "../VM/float";
import * as Signed from "../VM/signed";

export class Assembler {
  private idBits: number;
  private MaxLength: number;
  private bitBlock: number;
  private regLength: number;
  private adrOffset: number;
  private offset: number;
  private machineCode: string[];
  private structures: any;
  private labeles: any;
  private calls: any;
  private variables: any;
  instCounter: number;
  private inlineData: any;
  private useLabel: any;
  private strTrack: any;
  static showCode(code: string) {
    let line = "";
    code.split("").forEach((element) => {
      if (line.length == 32) {
        console.log(line);
        line = "";
      }
      line += element;
    });
    console.log(line);
  }
  constructor() {
    this.idBits = 3;
    this.bitBlock = 8;
    this.MaxLength = 32;
    this.regLength = regMap.max;
    this.adrOffset = 5;
    this.offset = 0;
    this.machineCode = [];
    this.structures = {};
    this.labeles = {};
    this.calls = {};
    this.variables = {};
    this.instCounter = 0;
    this.inlineData = {};
    this.useLabel = {};
    this.strTrack = {};
  }
  makeLiteral(lit: number, base: number = -100): string {
    if (lit != Math.floor(lit)) {
      return Float.makeMemoryFloat(lit);
    } else if (lit < 0) {
      return Signed.makeMemorySigned(lit);
    }
    let len =
      Math.ceil(
        Math.max(lit.toString(2).length + this.idBits, base) / this.bitBlock
      ) - 1;
    let copy = lit.toString(2);
    return (
      len.toString(2).padStart(this.idBits, "0") +
      copy.padStart((len + 1) * this.bitBlock - this.idBits, "0")
    );
  }
  makeRegister(regName: string) {
    // @ts-ignore
    return regMap[regName];
  }
  makeAddress(adr: number) {
    let word = Math.floor(adr / this.MaxLength).toString(2);
    let offset = (adr % this.MaxLength)
      .toString(2)
      .padStart(this.adrOffset, "0");
    let size = Math.ceil(
      (word.length + offset.length + this.idBits) / this.bitBlock
    );
    return (
      (size - 1).toString(2).padStart(this.idBits, "0") +
      (word + offset).padStart(size * this.bitBlock - this.idBits, "0")
    );
  }
  decode(obj: any, label: boolean): any {
    switch (obj.type) {
      case "binDigit":
      case "decDigit":
      case "hexDigit":
        return obj.args[0];

      case "adrDigit":
        return this.decode(obj.args[0], label);
      case "variable":
        if (label) {
          if (!this.useLabel[obj.args[0]]) this.useLabel[obj.args[0]] = [];
          this.useLabel[obj.args[0]].push(this.offset);
          return obj.args[0];
        }
        if (obj.args[0] in this.strTrack) return this.strTrack[obj.args[0]];
        if (!this.labeles[obj.args[0]] == undefined) return obj.args[0];
        else return this.labeles[obj.args[0]];
      case "Reg":
        //@ts-ignore
        return regMap[obj.args[0].toUpperCase()];
      case "ascii":
        return this.strTrack[obj.args[0]];
      case "AB":
        let a = this.decode(obj.a, label);
        let b = this.decode(obj.b, label);
        switch (obj.op.args[0]) {
          case "*":
            return a * b;
          case "+":
            return a + b;
          case "-":
            return a - b;
          case "/":
            throw new Error("still didn't implement the float");
          default:
            break;
        }
        break;
      default:
        throw new Error("unknown type: " + obj.type);
    }
  }
  makeInlineData(data: any) {
    this.makeCode(instOpCode.INLINEDATA, instType.NA);
    data.args[2].map((d: any) =>
      this.makeCode(
        this.makeLiteral(this.decode(d, false), Number(data.args[0]))
      )
    );
  }
  makeDataInterface(line: any) {
    let [name, obj] = line.args;
    this.structures[name] = JSON.parse(JSON.stringify(obj));
    for (const key in this.structures[name]) {
      this.structures[name][key] = this.decode(
        this.structures[name][key],
        false
      );
    }
  }
  makeCode(...codes: string[]) {
    for (const element of codes) {
      if (element.includes("NaN")) {
        console.trace("unkonw number");
        throw new Error("stop");
      }
    }
    codes.forEach((code) => {
      this.offset += code.length;
      this.machineCode.push(code);
    });
  }
  handleArgs(args: any, type: string) {
    let newtype = type.split("_");
    args.map((arg: any, i: number) => {
      if (arg.type == "Reg") return;
      if (arg.type == "adrDigit") return;
      let res = this.decode(arg, false);
      if (res != Math.floor(res)) {
        newtype[i] = "F" + newtype[i];
      } else if (res < 0) {
        newtype[i] = "S" + newtype[i];
      }
    });
    //@ts-ignore
    this.makeCode(instType[newtype.join("_")]);
    args.map((arg: any, i: number) => {
      if (arg.type == "Reg") return this.makeCode(this.decode(arg, false));
      if (arg.type == "adrDigit") {
        let ress = this.decode(arg, true);
        if (isNaN(ress * 1)) {
          this.handleVariables(arg.args[0]);
          return "";
        } else {
          return this.makeCode(this.makeLiteral(this.decode(arg, false)));
        }
      }
      let res = this.decode(arg, false);
      return this.makeCode(this.makeLiteral(res));
    });
  }
  handleVariables(arg: any) {
    let label = "inst" + this.instCounter + "X";
    ++this.instCounter;
    this.variables[label] = {
      offset: this.offset,
      arg,
    };
    this.machineCode.push(label);
  }
  generateBits(input: string, off = 0, noHeader = false) {
    this.offset = off;
    this.machineCode = [];
    this.structures = {};
    this.labeles = {};
    this.calls = {};
    this.variables = {};
    this.instCounter = 0;
    this.inlineData = {};
    this.useLabel = {};
    this.strTrack = {};

    let output = Parser.run(input);
    let record = {};
    //@ts-ignore
    output.result.forEach((line) => {
      if (line.inst) {
        //@ts-ignore
        if (!record[line.inst.toUpperCase()])
          //@ts-ignore
          record[line.inst.toUpperCase()] = 0;
        //@ts-ignore
        record[line.inst.toUpperCase()]++;
      }
      if (line.type == "ascii") {
        //@ts-ignore
        if (!record[line.type.toUpperCase()])
          //@ts-ignore
          record[line.type.toUpperCase()] = 0;
        //@ts-ignore
        record[line.type.toUpperCase()]++;
      }
    });
    let dict = MakeHeader(record, noHeader);

    if (!noHeader) this.makeCode(dict.header);
    //@ts-ignore
    output.result.forEach((line) => {
      if (line.type) {
        switch (line.type) {
          case "label": {
            let name = line.args[0];
            if (this.labeles[name])
              throw new Error("this label already exist: " + name);
            this.labeles[name] = this.offset;

            break;
          }
          case "comment":
            break;
          case "inlineData":
            this.makeInlineData(line);
            break;
          case "dataInterface":
            this.makeDataInterface(line);
            break;
          case "ascii": {
            //@ts-ignore
            this.makeCode(dict.table[line.type.toUpperCase()], instType.NA);
            let name = line.args[0];
            let str = line.args[1].split("");
            if (this.variables[name] != undefined)
              throw new Error("sorry this naming already exists: " + name);
            this.strTrack[name] = this.offset;
            str.pop();
            str.shift();
            //@ts-ignore
            str.forEach((letter) => {
              this.makeCode(letter.charCodeAt(0).toString(2).padStart(8, "0"));
            });
            this.makeCode("0".repeat(8));
            break;
          }
          default:
            throw new Error("unknown type: " + line.type);
        }
      }
      if (line.inst) {
        this.makeCode(
          //@ts-ignore
          dict.table[line.inst.toUpperCase()]
        );
        this.handleArgs(line.args, line.instType);
      }
    });
    this.trackLabels();
    this.trackOther();
    this.trackLabels();
    let code = this.machineCode.join("");
    for (const key in this.labeles) {
      let res = this.makeAddress(this.labeles[key]);
      code = code.replace(new RegExp(key, "g"), res);
    }
    for (const key in this.variables) {
      let value = this.decode(this.variables[key].arg, false);
      if (value == NaN) throw new Error("Label Error1");
      code = code.replace(new RegExp(key, "g"), this.makeAddress(value));
    }

    return code;
  }
  getSize(size: number) {
    return Math.ceil((size.toString(2).length + this.idBits) / this.bitBlock);
  }
  trackLabels() {
    let labelSize = {
      ...this.labeles,
    };
    for (const key in labelSize) {
      labelSize[key] = Math.max(1, this.getSize(labelSize[key]));
    }
    let tracker = {};
    for (const key in this.labeles) {
      let offset = this.labeles[key];
      for (const key1 in this.calls) {
        //@ts-ignore
        this.calls[key1].forEach((d) => {
          if (d <= offset) {
            //@ts-ignore
            if (!tracker[key]) {
              //@ts-ignore
              tracker[key] = {};
              //@ts-ignore
              tracker[key][key1] = 0;
            }
            //@ts-ignore
            ++tracker[key][key1];
          }
        });
      }
    }
    let test = false;
    for (const key in this.labeles) {
      let newSize = this.labeles[key];
      //@ts-ignore
      for (const key1 in tracker[key]) {
        //@ts-ignore
        newSize += tracker[key][key1] * labelSize[key1] * this.bitBlock;
        if (this.getSize(newSize) != this.getSize(this.labeles[key])) {
          test = true;
        }
        this.labeles[key] = newSize;
      }
    }
    if (test) this.trackLabels();
  }
  trackOther() {
    let adder = {};

    for (const key in this.variables) {
      let value = this.decode(this.variables[key].arg, false);
      if (value == NaN) throw new Error("Label Error");
      let offset = this.variables[key].offset;
      for (const key1 in this.labeles) {
        if (offset <= this.labeles[key1]) {
          //@ts-ignore
          if (!adder[key1])
            //@ts-ignore
            adder[key1] = {
              counter: 0,
              offset,
            };
          //@ts-ignore
          adder[key1].counter += this.getSize(value) * this.bitBlock;
        }
      }
    }
    for (const key in adder) {
      let oldSize = this.getSize(this.labeles[key]);
      //@ts-ignore
      let newSize = this.getSize(this.labeles[key] + adder[key].counter);
      //@ts-ignore
      this.labeles[key] += adder[key].counter;
      if (newSize != oldSize) {
        this.updateLabel(key);
      }
    }
  }
  updateLabel(key: string) {
    //@ts-ignore
    this.useLabel[key].forEach((d) => {
      for (const key1 in this.labeles) {
        if (this.labeles[key1] >= d) {
          let old = this.labeles[key1];
          this.labeles[key1] += this.bitBlock;
          if (this.getSize(old) != this.getSize(old + this.bitBlock)) {
            this.updateLabel(key1);
          }
        }
      }
    });
  }
}
