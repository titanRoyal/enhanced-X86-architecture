export function makeRegisterFloat(num: number) {
  let sign = num < 0 ? "1" : "0";
  num = Math.abs(num);
  let exp = Math.floor(num).toString(2).length - 1 + 127;
  let mont = num.toString(2).split(".").join("").substr(1, 23);
  let result = (sign + exp.toString(2).padStart(8, "0") + mont).padEnd(32, "0");
  return result;
}

export function makeMemoryFloat(num: number) {
  let sign = num < 0 ? "1" : "0";
  num = Math.abs(num);
  // let exp = (Math.floor(num).toString(2).length - 1) + 127;
  let exp = num.toString(2).split(".")[0].length + 127;
  let mont = num.toString(2).split(".").join("").substr(0, 23);
  let len = Math.ceil((1 + 8 + mont.length + 3) / 8) - 1;
  let result =
    len.toString(2).padStart(3, "0") +
    (sign + exp.toString(2).padStart(8, "0") + mont).padEnd(
      8 * (len + 1 - 3),
      "0"
    );
  return result;
}

export function decodeRegisterFloat(num: number) {
  //@ts-ignore
  num = num.toString(2);
  //@ts-ignore
  let sign = num[0] == "0" ? 1 : -1;
  //@ts-ignore
  let exp = ("0b" + num.substr(1, 8)) * 1 - 127;
  //@ts-ignore
  let int = Number("0b1" + num.substr(9, exp));
  //@ts-ignore
  let float = num.substr(9 + exp);
  //@ts-ignore
  float.split("").forEach((data, index) => {
    if (data == "1") int += Math.pow(2, -1 * (index + 1));
  });
  return int * sign;
}

export function decodeMemoryFloat(num: number) {
  //@ts-ignore
  num = num.toString(2);
  //@ts-ignore
  let sign = num[0] == "0" ? 1 : -1;
  //@ts-ignore
  let exp = Number("0b" + num.substr(1, 8)) - 127;
  //@ts-ignore
  let int = num.substr(9, exp);
  //@ts-ignore
  let float = num.substr(1 + 8 + int.length);
  //@ts-ignore
  int = ("0b" + int) * 1 || 0;
  //@ts-ignore
  float.split("").forEach((data, index) => {
    if (data != "0") int += Math.pow(2, -1 * (index + 1));
  });
  return int * sign;
}
