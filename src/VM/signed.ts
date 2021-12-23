export function makeRegisterSigned(num: number): string {
    let sign = (num < 0) ? "1" : "0";
    let body = Math.abs(num).toString(2);
    return (sign.padEnd(32 - (body.length), "0") + body)
}

export function makeMemorySigned(num: number): string {
    let sign = (num < 0) ? "1" : "0";
    let body = Math.abs(num).toString(2);
    let len = Math.ceil((body.length + 1) / 8);
    return (len - 1).toString(2).padStart(3, "0") + sign.padEnd(len * 8 - body.length, "0") + body
}

export function decodeRegisterSigned(num: number): number {
    let str = num.toString(2);
    let body = Number("0b" + str.substring(1));
    let sign = (str[0] == "0") ? 1 : -1;
    return body * sign;
}

export function decodeMemorySigned(num: number): number {
    let str = num.toString(2);
    let body = Number("0b" + str.substring(1));
    let sign = (str[0] == "0") ? 1 : -1;
    return body * sign;
}