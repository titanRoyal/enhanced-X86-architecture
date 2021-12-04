import Parser from "../parser";

import regMap from "./regMap";

import instOpCode from "../instMeta/inst";

import instType from "../instMeta/type";

import { label } from "../parser/label";
import { MakeHeader } from "../instMeta/makeInstruction";

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
    this.adrOffset = 6;
    this.offset = 0;
    this.machineCode = [];
    this.structures = {};
    this.labeles = {};
    this.calls = {};
  }
  makeLiteral(lit: number, base: number = -100): string {
    let len =
      Math.ceil(Math.max(lit.toString(2).length, base) / this.bitBlock) - 1;
    let copy = lit.toString(2);
    return (
      String(len).padStart(this.idBits, "0") +
      copy.padStart((len + 1) * this.bitBlock, "0")
    );
  }
  makeRegister(regName: string) {
    // @ts-ignore
    return regMap[regName];
  }
  makeAddress(adr: number) {
    let len = Math.ceil(adr.toString(2).length / this.bitBlock) - 1;
    let copy = adr.toString(2);
    return (
      String(len).padStart(this.idBits, "0") +
      copy.padStart((len + 1) * this.bitBlock, "0")
    );
  }
  decode(obj: any): any {
    switch (obj.type) {
      case "binDigit":
      case "decDigit":
      case "hexDigit":
        return obj.args[0];

      case "adrDigit":
        return this.decode(obj.args[0]);
      case "variable":
        return obj.args[0];
      case "Reg":
        //@ts-ignore
        return regMap[obj.args[0].toUpperCase()];
      case "AB":
        let a = this.decode(obj.a);
        let b = this.decode(obj.b);
        switch (obj.op.args[0]) {
          case "*":
            return a * b;
          case "+":
            return a + b;
          case "-":
            return a - b;
          case "/":
            throw "still didn't implement the float";
          default:
            break;
        }
        break;
      default:
        throw "unknown type: " + obj.type;
    }
  }
  makeInlineData(data: any) {
    let args = data.args[2].map((d: any) =>
      this.makeLiteral(this.decode(d), Number(data.args[0]))
    );
    args.forEach((arg: string) => {
      this.makeCode(arg);
    });
  }
  makeDataInterface(line: any) {
    let [name, obj] = line.args;
    this.structures[name] = JSON.parse(JSON.stringify(obj));
    for (const key in this.structures[name]) {
      this.structures[name][key] = this.decode(this.structures[name][key]);
    }
  }
  makeCode(...codes: string[]) {
    codes.forEach((code) => {
      this.offset += code.length;
      this.machineCode.push(code);
    });
  }
  handleArgs(args: any) {
    args
      .map((arg: any) => {
        if (arg.type == "Reg") return this.decode(arg);
        if (arg.type == "adrDigit") {
          let res = this.decode(arg);
          if (isNaN(res * 1)) {
            if (!this.calls[res]) this.calls[res] = [];
            this.calls[res].push(this.offset);
            this.machineCode.push(res);
            return "";
          } else {
            return this.makeLiteral(this.decode(arg));
          }
        }
        return this.makeLiteral(this.decode(arg));
      })
      .forEach((d: any) => {
        this.makeCode(d);
      });
  }
  generateBits(input: string) {
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
    });
    let dict = MakeHeader(record);
    //@ts-ignore
    output.result.forEach((line) => {
      if (line.type) {
        switch (line.type) {
          case "label": {
            let name = line.args[0];
            if (this.labeles[name]) throw "this label already exist: " + name;
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
          default:
            throw "unknown type: " + line.type;
        }
      }
      if (line.inst) {
        this.makeCode(
          //@ts-ignore
          instOpCode[line.inst.toUpperCase()],
          //@ts-ignore
          instType[line.instType]
        );
        this.handleArgs(line.args);
      }
    });
    this.trackLabels();
    let code = this.machineCode.join("");
    for (const key in this.labeles) {
      let res = this.makeAddress(this.labeles[key]);
      code = code.replace(new RegExp(key, "g"), res);
    }
    return code;
  }
  getSize(size: number) {
    return Math.ceil(Math.log(size) / Math.log(2) / this.bitBlock);
  }
  trackLabels() {
    //TODO: calculating the labels size according to the bitBlock size
    let labelSize = { ...this.labeles };
    for (const key in labelSize) {
      labelSize[key] = Math.max(1, this.getSize(labelSize[key]));
    }
    //TODO: combine the labels tab with the calls tab
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
        if (this.getSize(newSize) != this.getSize(this.labeles[key]))
          test = true;
        this.labeles[key] = newSize;
      }
    }
    if (test) this.trackLabels();
  }
}
