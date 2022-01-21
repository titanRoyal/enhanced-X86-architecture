import GIS from "../instMeta/inst";

export function MakeBinaryInstruction(
  status: any,
  maxInstructionLength: number
) {
  let instructionCount = 0,
    UniqueInstructionCount = 0;
  for (const key in status) {
    ++UniqueInstructionCount;
    instructionCount += status[key];
  }
  let level = 0;
  while (true) {
    if (Math.pow(2, level) >= UniqueInstructionCount) break;
    else ++level;
  }
  let currentmaxGain = (maxInstructionLength - level) * instructionCount;
  let levelTab = [level];
  for (let i = 1; i < level; i++) {
    for (let i1 = i + 1; i1 < level; i1++) {
      let many = Math.pow(2, i) + Math.pow(2, i1);
      if (many >= UniqueInstructionCount) {
        let gainn = calcGain([i, i1], status, maxInstructionLength);
        if (gainn > currentmaxGain) {
          currentmaxGain = gainn;
          levelTab = [i, i1];
        }
      }
    }
  }
  let sequence = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  let recover =
    sequence.length +
    1 +
    UniqueInstructionCount * maxInstructionLength +
    maxInstructionLength;
  // console.log(currentmaxGain,recover)
  let decision = recover < currentmaxGain;
  if (decision) {
    levelTab.forEach((data) => {
      sequence[data] = 1;
    });
    sequence.shift();
    //@ts-ignore
    sequence = sequence.join("");

    let table = makeInstructionTable(levelTab, status);
    return [true, sequence, table, currentmaxGain];
  } else {
    return [false, "0", null, -1];
  }
}

export function makeInstructionTable(levels: any, state: any) {
  let inst: any = [],
    table: any = [];
  for (const key in state) {
    inst.push({
      instruction: key,
      count: state[key],
    });
  }
  //@ts-ignore
  inst.sort((a, b) => b.count - a.count);
  //@ts-ignore
  levels.forEach((data, index) => {
    let last = index == levels.length - 1 ? "" : "0";
    for (let i = 0; i < Math.pow(2, data); i++) {
      let number = i.toString(2).padStart(data, "0") + last;
      for (let i1 = 0; i1 < index; i1++) {
        number = insertStr(number, levels[i1] + i1, "1");
      }
      if (inst.length > 0) {
        table.push({
          inst: inst.shift().instruction,
          code: number,
        });
      }
    }
  });
  return table;
}

export function insertStr(str: string, pos: number, fill: string) {
  let upper = str.substr(0, pos);
  let lower = str.substr(pos);
  return upper + fill + lower;
}

export function MakeHeader(state: any, noHeader = false) {
  let [decision, sqn, table, gain] = MakeBinaryInstruction(state, GIS.max);
  if (!decision || noHeader) {
    let tablee = {};
    for (const key in state) {
      //@ts-ignore
      tablee[key] = GIS[key];
    }
    return {
      header: "0",
      table: tablee,
    };
  } else {
    sqn = "1" + sqn;
    let arr = [];
    for (const key in state) {
      arr.push({
        Inst: key,
        count: state[key],
      });
    }
    arr.sort((a, b) => b.count - a.count);
    arr.forEach((data) => {
      //@ts-ignore
      sqn += GIS[data.Inst];
    });
    sqn += "0".repeat(GIS.max);
    //@ts-ignore
    table = table.reduce((acc, curr) => {
      acc[curr.inst] = curr.code;
      return acc;
    }, {});
    return {
      header: sqn,
      table,
      gain,
    };
  }
}

export function calcGain(levels: any, status: any, maxInstructionLength: any) {
  let arr: any = [];
  let gain = 0;
  for (const key in status) {
    arr.push(status[key]);
  }
  //@ts-ignore
  arr.sort((a, b) => b - a);
  //@ts-ignore
  levels.forEach((data, index) => {
    let max = Math.pow(2, data);
    let last = index == levels.length - 1 ? -1 : 0;
    for (let i = 0; i < max; i++) {
      if (arr.length == 0) break;
      let difference =
        (maxInstructionLength - (data + index + 1 + last)) * arr[0];
      gain += difference;
      arr.shift();
    }
  });
  return gain;
}