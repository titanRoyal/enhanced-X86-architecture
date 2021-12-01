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
  decode(obj: any) {
    switch (obj.type) {
      case "binDigit":
      case "decDigit":
      case "hexDigit":
      case "adrDigit":
        return this.makeLiteral(obj.args[0]);
      case "Reg":
        //@ts-ignore
        return regMap[obj.args[0].toUpperCase()];

      default:
        break;
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
      .map((arg: any) => this.decode(arg))
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
            console.log("label: " + line.args[0]);
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
        console.log(line);
        this.makeCode(
          //@ts-ignore
          instOpCode[line.inst.toUpperCase()],
          //@ts-ignore
          instType[line.instType]
        );
        this.handleArgs(line.args);
      }
    });
    return this.machineCode.join("");
  }
}
