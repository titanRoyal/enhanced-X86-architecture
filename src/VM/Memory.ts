import MemoryInt from "./interface";
type region = {
  offset: number;
  size: number;
};
export class Memory implements MemoryInt {
  public size: number;
  public bits: string;
  public regions: region[];
  constructor(size: number) {
    this.size = size;
    this.bits = "0".repeat(size);
    this.regions = [];
  }

  ///////////// read lit/adr ///////////////////////
  readAddress(offset: number) {
    //@ts-ignore
    let len = (this.getNbit(offset, 3) + 1) * 8;
    let body = this.getNbit(offset + 3, len - 6);
    let off = this.getNbit(offset + 3 + (len - 6), 6);
    //@ts-ignore
    return body * 64 + off;
  }
  readLiteral(offset: number): string {
    //@ts-ignore
    let len = (this.getNbit(offset, 3) + 1) * 8;
    let body = this.getNbit(offset + 3, len - 3);
    return String(body);
  }
  ///////////// getters ///////////////////////
  getNbit(offset: number, base: number, isString = false): string | number {
    //@ts-ignore
    if (!isString) return ("0b" + this.bits.substr(offset, base)) * 1;
    return this.bits.substr(offset, base);
  }
  getbit8(offset: number, isString = false): string | number {
    //@ts-ignore
    if (!isString) return ("0b" + this.bits.substr(offset, 8)) * 1;
    return this.bits.substr(offset, 8);
  }
  makeMemoryLiteral(lit: number): string {
    let body = lit.toString(2);
    let size = Math.ceil((body.length + 3) / 8);
    return (
      (size - 1).toString(2).padStart(3, "0") + body.padStart(size * 8 - 3, "0")
    );
  }
  getLiteral(offset: number, isString = false) {
    let size = (this.getNbit(offset, 3) as number) + 1;
    size = size * 8 - 3;
    return this.getNbit(offset + 3, size, isString);
  }
  getbit16(offset: number, isString = false): string | number {
    //@ts-ignore
    if (!isString) return ("0b" + this.bits.substr(offset, 16)) * 1;
    return this.bits.substr(offset, 16);
  }
  getbit24(offset: number, isString = false): string | number {
    //@ts-ignore
    if (!isString) return ("0b" + this.bits.substr(offset, 24)) * 1;
    return this.bits.substr(offset, 24);
  }
  getbit32(offset: number, isString = false): string | number {
    //@ts-ignore
    if (!isString) return ("0b" + this.bits.substr(offset, 32)) * 1;
    return this.bits.substr(offset, 32);
  }
  getbit40(offset: number, isString = false): string | number {
    //@ts-ignore
    if (!isString) return ("0b" + this.bits.substr(offset, 40)) * 1;
    return this.bits.substr(offset, 40);
  }
  getbit48(offset: number, isString = false): string | number {
    //@ts-ignore
    if (!isString) return ("0b" + this.bits.substr(offset, 48)) * 1;
    return this.bits.substr(offset, 48);
  }
  getbit56(offset: number, isString = false): string | number {
    //@ts-ignore
    if (!isString) return ("0b" + this.bits.substr(offset, 56)) * 1;
    return this.bits.substr(offset, 56);
  }
  getbit64(offset: number, isString = false): string | number {
    //@ts-ignore
    if (!isString) return ("0b" + this.bits.substr(offset, 64)) * 1;
    return this.bits.substr(offset, 64);
  }
  ///////////// setters ///////////////////////
  setLiteral(offset: number, lit: number) {
    let value = this.makeMemoryLiteral(lit);
    this.replace(offset, value);
  }
  setNbit(offset: number, value: number | string, base?: number) {
    if (!base) base = Math.ceil(value.toString(2).length / 8) * 8;
    this.replace(offset, value, base);
  }
  setbit8(offset: number, value: number | string) {
    this.replace(offset, value, 8);
  }
  setbit16(offset: number, value: number | string) {
    this.replace(offset, value, 16);
  }
  setbit24(offset: number, value: number | string) {
    this.replace(offset, value, 24);
  }
  setbit32(offset: number, value: number | string) {
    this.replace(offset, value, 32);
  }
  setbit40(offset: number, value: number | string) {
    this.replace(offset, value, 40);
  }
  setbit48(offset: number, value: number | string) {
    this.replace(offset, value, 48);
  }
  setbit56(offset: number, value: number | string) {
    this.replace(offset, value, 56);
  }
  setbit64(offset: number, value: number | string) {
    this.replace(offset, value, 64);
  }
  ///////////// Other tools ///////////////////////
  alloc(size: number): number {
    let offsets = this.regions.reduce((acc, curr) => {
      //@ts-ignore
      acc[curr.offset] = curr.size;
      return acc;
    }, {});

    for (let i = 0; i < this.size; i++) {
      if (i in offsets) {
        //@ts-ignore
        i += offsets[i] - 1;
        continue;
      } else {
        let end = size + i;
        let test = true;
        for (const key in offsets) {
          //@ts-ignore
          if (key >= i && key < end) {
            test = false;
            break;
          }
        }
        if (test) {
          this.regions.push({
            offset: i,
            size,
          });
          return i;
        }
      }
    }

    throw `there is no place to place this size "${size}" in Memory`;
  }
  injectCode(offset: number, str: string) {
    let first = this.bits.substring(0, offset);
    let rest = this.bits.substr(offset + str.length);
    this.bits = first + str + rest;
  }
  replace(offset: number, value: number | string, base?: number) {
    if (offset >= this.size) throw `sorry offset out of bounds`;
    let str = value.toString(2);
    if (!base) base = str.length;
    if (base + offset > this.size)
      throw `sorry can't fit value ${value} represented by ${str} because it exceeds memory size limits`;
    if (str.length > base)
      throw `sorry can't fit value ${value} represented by ${str} in ${base} bit slot.`;
    let first = this.bits.substr(0, offset);
    let second = this.bits.substring(offset + base);
    this.bits = first + str.padStart(base, "0") + second;
  }
}
