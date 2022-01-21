export default interface MemoryInt {
  size: number;
  bits: string;
  regions: any;
  readAddress(offset: number): string;

  readLiteral(offset: number): string;

  getNbit(offset: number, base: number, isString?: boolean): string | number;

  getbit8(offset: number, isString?: boolean): string | number;

  getbit16(offset: number, isString?: boolean): string | number;

  getbit24(offset: number, isString?: boolean): string | number;

  getbit32(offset: number, isString?: boolean): string | number;

  getbit40(offset: number, isString?: boolean): string | number;

  getbit48(offset: number, isString?: boolean): string | number;

  getbit56(offset: number, isString?: boolean): string | number;

  getbit64(offset: number, isString?: boolean): string | number;

  setNbit(offset: number, value: number | string, base?: number): void;

  setbit8(offset: number, value: number | string): void;

  setbit16(offset: number, value: number | string): void;

  setbit24(offset: number, value: number | string): void;

  setbit32(offset: number, value: number | string): void;

  setbit40(offset: number, value: number | string): void;

  setbit48(offset: number, value: number | string): void;

  setbit56(offset: number, value: number | string): void;

  setbit64(offset: number, value: number | string): void;

  injectCode(offset: number, str: string): void;

  replace(offset: number, value: number | string, base: number): void;
}
