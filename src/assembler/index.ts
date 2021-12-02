/*
    1- combine the labels tab with the calls tab

    2-check if  the label stays in his 8bit range with the calls in its actuall length

    3- if yes then move on

    4- if no then increase the range of the label and update the tables,jump to stap 2;

    5- if all the labels are satisfied then replace the labels in the machin code with the actual memory addresses
    
*/

import Parser from "../parser";

import regMap from "./regMap";

import instOpCode from "../instMeta/inst";

import instType from "../instMeta/type";

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
        console.log(obj);
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
    // console.log(codes);
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
    //@ts-ignore
    output.result.forEach((line) => {
      if (line.type) {
        switch (line.type) {
          case "label": {
            this.machineCode.push("|");
            let name = line.args[0];
            if (this.labeles[name]) throw "this label already exist: " + name;
            this.labeles[name] = this.offset;

            break;
          }
          case "comment":
            console.log("comment !!!!");
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
    console.log(this.labeles);
    console.log(this.calls);
    return this.machineCode.join("");
  }
}
