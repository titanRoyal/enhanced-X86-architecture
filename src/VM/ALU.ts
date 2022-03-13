import ps from "prompt-sync";
import CPU from "./cpu";

let prompt = ps();

export let movALU = function (
  cpu: CPU,
  opcode: string,
  type: string,
  args: any
) {
  switch (opcode) {
    case "MOV":
      {
        switch (type) {
          case "L_R":
            cpu.SetRegister(args[1], args[0]);
            break;
          case "L_M":
            cpu.Mapper.setNbit(args[1], args[0]);
            break;
          case "R_R":
            cpu.SetRegister(args[1], cpu.getRegister(args[0]) as number);
            break;
          case "R_M":
            cpu.Mapper.setLiteral(args[1], cpu.getRegister(args[0]) as number);
            break;
          case "M_R":
            cpu.SetRegister(args[1], cpu.Mapper.getLiteral(args[0]) as number);
            break;
          case "L_R_L": {
            let value = cpu.Mapper.makeMemoryLiteral(args[0]);
            let offset = args[2];
            let reg =
              (cpu.getRegister(args[1]) as number) - offset * cpu.bitBlock;
            let sp = cpu.getRegister("sp");
            if (sp > reg) {
              cpu.SetRegister("sp", reg);
            }
            cpu.Mapper.setNbit(reg, value);
            break;
          }
          case "R_R_L": {
            let value = cpu.Mapper.makeMemoryLiteral(
              cpu.getRegister(args[0]) as number
            );
            console.log("/////////////////////////");
            console.log(value);
            console.log("/////////////////////////");
            let offset = args[2];
            let reg =
              (cpu.getRegister(args[1]) as number) - offset * cpu.bitBlock;
            let sp = cpu.getRegister("sp");
            if (sp > reg) {
              cpu.SetRegister("sp", reg);
            }
            cpu.Mapper.setNbit(reg, value);
            break;
          }
          case "R_L_R": {
            let offset = args[1];
            let reg = (cpu.getRegister(args[0]) as number) - offset * 8;
            let dist = args[2];
            let value = Number(cpu.Mapper.readLiteral(reg));
            cpu.SetRegister(dist, value);
            break;
          }

          default:
            throw new Error(`unknown type in (movALU->${opcode}): "${type}"`);
        }
      }
      break;
    default:
      throw new Error(`Unknown  instructioon for movALU: "${opcode}"`);
  }
};
export let stackALU = function (
  cpu: any,
  opcode: string,
  type: string,
  args: any
) {
  switch (opcode) {
    case "PSH": {
      switch (type) {
        case "R":
          cpu.push(cpu.getRegister(args[0]));
          break;
        case "L":
          cpu.push(args[0]);
          break;

        default:
          throw new Error(`unknown type in (stackALU->${opcode}): "${type}"`);
      }
      return;
    }
    case "POP": {
      switch (type) {
        case "R":
          cpu.SetRegister(args[0], cpu.pop());
          break;

        default:
          throw new Error(`unknown type in (stackALU->${opcode}): "${type}"`);
      }
      return;
    }

    default:
      throw new Error(`Unknown  instructioon for stackALU: "${opcode}"`);
  }
};
export let fnCalALU = function (
  cpu: any,
  opcode: string,
  type: string,
  args: any
) {
  switch (opcode) {
    case "CAL": {
      switch (type) {
        case "R":
          cpu.pushFrame();
          cpu.SetRegister("IP", cpu.getRegister(args[0]));
          break;
        case "L":
        case "M":
          cpu.pushFrame();
          cpu.SetRegister("IP", args[0]);
          break;

        default:
          throw new Error(`unknown type in (fnCalALU->${opcode}): "${type}"`);
      }
      return;
    }
    case "RET": {
      switch (type) {
        case "NA":
          cpu.popFrame();
          break;

        default:
          throw new Error(`unknown type in (fnCalALU->${opcode}): "${type}"`);
      }
      return;
    }

    default:
      throw new Error(`Unknown  instructioon for fnCalALU: "${opcode}"`);
  }
};
export let bitwiseALU = function (
  cpu: any,
  opcode: string,
  type: string,
  args: any
) {
  switch (opcode) {
    case "AND": {
      switch (type) {
        case "R_R": {
          let r1 = cpu.getRegister(args[0]);
          let r2 = cpu.getRegister(args[1]);
          cpu.SetRegister("ACC", r1 & r2);
          break;
        }
        case "R_L": {
          let r1 = cpu.getRegister(args[0]);
          let r2 = args[1];
          cpu.SetRegister("ACC", r1 & r2);
          break;
        }

        default:
          throw new Error(`unknown type in (bitwiseALU->${opcode}): "${type}"`);
      }
      return;
    }
    case "OR": {
      switch (type) {
        case "R_R": {
          let r1 = cpu.getRegister(args[0]);
          let r2 = cpu.getRegister(args[1]);
          cpu.SetRegister("ACC", r1 | r2);
          break;
        }
        case "R_L": {
          let r1 = cpu.getRegister(args[0]);
          let r2 = args[1];
          cpu.SetRegister("ACC", r1 | r2);
          break;
        }

        default:
          throw new Error(`unknown type in (bitwiseALU->${opcode}): "${type}"`);
      }
      return;
    }
    case "XOR": {
      switch (type) {
        case "R_R": {
          let r1 = cpu.getRegister(args[0]);
          let r2 = cpu.getRegister(args[1]);
          cpu.SetRegister("ACC", r1 ^ r2);
          break;
        }
        case "R_L": {
          let r1 = cpu.getRegister(args[0]);
          let r2 = args[1];
          cpu.SetRegister("ACC", r1 ^ r2);
          break;
        }

        default:
          throw new Error(`unknown type in (bitwiseALU->${opcode}): "${type}"`);
      }
      return;
    }
    case "LSH": {
      switch (type) {
        case "R_R": {
          let r1 = cpu.getRegister(args[0]);
          let r2 = cpu.getRegister(args[1]);
          cpu.SetRegister("ACC", r1 << r2);
          break;
        }
        case "R_L": {
          let r1 = cpu.getRegister(args[0]);
          let r2 = args[1];
          cpu.SetRegister("ACC", r1 << r2);
          break;
        }
        case "L_R": {
          let r2 = args[0];
          let r1 = cpu.getRegister(args[1]);
          cpu.SetRegister("ACC", r2 << r1);
          break;
        }

        default:
          throw new Error(`unknown type in (bitwiseALU->${opcode}): "${type}"`);
      }
      return;
    }
    case "RSH": {
      switch (type) {
        case "R_R": {
          let r1 = cpu.getRegister(args[0]);
          let r2 = cpu.getRegister(args[1]);
          cpu.SetRegister("ACC", r1 >> r2);
          break;
        }
        case "R_L": {
          let r1 = cpu.getRegister(args[0]);
          let r2 = args[1];
          cpu.SetRegister("ACC", r1 >> r2);
          break;
        }
        case "L_R": {
          let r2 = args[0];
          let r1 = cpu.getRegister(args[1]);
          cpu.SetRegister("ACC", r2 >> r1);
          break;
        }

        default:
          throw new Error(`unknown type in (bitwiseALU->${opcode}): "${type}"`);
      }
      return;
    }
    case "NOT": {
      switch (type) {
        case "R": {
          let r1 = cpu.getRegister(args[0]);
          cpu.SetRegister("ACC", ~r1);
          break;
        }
        case "L": {
          let r1 = args[0];
          cpu.SetRegister("ACC", ~r1);
          break;
        }

        default:
          throw new Error(`unknown type in (bitwiseALU->${opcode}): "${type}"`);
      }
      return;
    }

    default:
      throw new Error(`Unknown  instructioon for stackALU: "${opcode}"`);
  }
};
export let branchALU = function (
  cpu: any,
  opcode: string,
  type: string,
  args: any
) {
  switch (opcode) {
    case "JEQ": {
      switch (type) {
        case "R_M": {
          let acc = cpu.getRegister("acc");
          let r1 = cpu.getRegister(args[0]);
          if (r1 == acc) cpu.SetRegister("IP", args[1]);
          break;
        }
        case "L_M": {
          let acc = cpu.getRegister("acc");
          let lit = args[0];
          if (lit == acc) cpu.SetRegister("IP", args[1]);
          break;
        }

        default:
          throw new Error(`unknown type in (branchALU->${opcode}): "${type}"`);
      }
      return;
    }
    case "JNE": {
      switch (type) {
        case "R_M": {
          let acc = cpu.getRegister("acc");
          let r1 = cpu.getRegister(args[0]);
          if (r1 != acc) cpu.SetRegister("IP", args[1]);
          break;
        }
        case "L_M": {
          let acc = cpu.getRegister("acc");
          let lit = args[0];
          if (lit != acc) cpu.SetRegister("IP", args[1]);
          break;
        }

        default:
          throw new Error(`unknown type in (branchALU->${opcode}): "${type}"`);
      }
      return;
    }
    case "JGT": {
      switch (type) {
        case "R_M": {
          let acc = cpu.getRegister("acc");
          let r1 = cpu.getRegister(args[0]);
          if (r1 > acc) cpu.SetRegister("IP", args[1]);
          break;
        }
        case "L_M": {
          let acc = cpu.getRegister("acc");
          let lit = args[0];
          if (lit > acc) cpu.SetRegister("IP", args[1]);
          break;
        }

        default:
          throw new Error(`unknown type in (branchALU->${opcode}): "${type}"`);
      }
      return;
    }
    case "JGE": {
      switch (type) {
        case "R_M": {
          let acc = cpu.getRegister("acc");
          let r1 = cpu.getRegister(args[0]);
          if (r1 >= acc) cpu.SetRegister("IP", args[1]);
          break;
        }
        case "L_M": {
          let acc = cpu.getRegister("acc");
          let lit = args[0];
          if (lit >= acc) cpu.SetRegister("IP", args[1]);
          break;
        }

        default:
          throw new Error(`unknown type in (branchALU->${opcode}): "${type}"`);
      }
      return;
    }
    case "JLT": {
      switch (type) {
        case "R_M": {
          let acc = cpu.getRegister("acc");
          let r1 = cpu.getRegister(args[0]);
          if (r1 < acc) cpu.SetRegister("IP", args[1]);
          break;
        }
        case "L_M": {
          let acc = cpu.getRegister("acc");
          let lit = args[0];
          if (lit < acc) cpu.SetRegister("IP", args[1]);
          break;
        }

        default:
          throw new Error(`unknown type in (branchALU->${opcode}): "${type}"`);
      }
      return;
    }
    case "JLE": {
      switch (type) {
        case "R_M": {
          let acc = cpu.getRegister("acc");
          let r1 = cpu.getRegister(args[0]);
          if (r1 <= acc) cpu.SetRegister("IP", args[1]);
          break;
        }
        case "L_M": {
          let acc = cpu.getRegister("acc");
          let lit = args[0];
          if (lit <= acc) cpu.SetRegister("IP", args[1]);
          break;
        }

        default:
          throw new Error(`unknown type in (branchALU->${opcode}): "${type}"`);
      }
      return;
    }
    case "JMP": {
      switch (type) {
        case "M": {
          cpu.SetRegister("IP", args[0]);
          break;
        }

        default:
          throw new Error(`unknown type in (branchALU->${opcode}): "${type}"`);
      }
      return;
    }

    default:
      throw new Error(`Unknown  instructioon for branchALU: "${opcode}"`);
  }
};
export let arethmeticALU = function (
  cpu: any,
  opcode: string,
  type: string,
  args: any
) {
  switch (opcode) {
    case "ADD": {
      switch (type) {
        case "R_R": {
          let r1 = cpu.getRegister(args[0]);
          let r2 = cpu.getRegister(args[1]);
          cpu.SetRegister("acc", r1 + r2);
          break;
        }
        case "R_L": {
          let r1 = cpu.getRegister(args[0]);
          let lit = args[1];
          cpu.SetRegister("acc", r1 + lit);
          break;
        }
        case "L_R": {
          let r1 = cpu.getRegister(args[1]);
          let lit = args[0];
          cpu.SetRegister("acc", r1 + lit);
          break;
        }

        default:
          throw new Error(
            `unknown type in (arethmeticALU->${opcode}): "${type}"`
          );
      }
      return;
    }
    case "MULT": {
      switch (type) {
        case "R_R": {
          let r1 = cpu.getRegister(args[0]);
          let r2 = cpu.getRegister(args[1]);
          cpu.SetRegister("acc", r1 * r2);
          break;
        }
        case "R_L": {
          let r1 = cpu.getRegister(args[0]);
          let lit = args[1];
          cpu.SetRegister("acc", r1 * lit);
          break;
        }
        case "L_R": {
          let r1 = cpu.getRegister(args[1]);
          let lit = args[0];
          cpu.SetRegister("acc", r1 * lit);
          break;
        }

        default:
          throw new Error(
            `unknown type in (arethmeticALU->${opcode}): "${type}"`
          );
      }
      return;
    }
    case "SUB": {
      switch (type) {
        case "R_R": {
          let r1 = cpu.getRegister(args[0]);
          let r2 = cpu.getRegister(args[1]);
          cpu.SetRegister("acc", r1 - r2);
          break;
        }
        case "R_L": {
          let r1 = cpu.getRegister(args[0]);
          let lit = args[1];
          cpu.SetRegister("acc", r1 - lit);
          break;
        }
        case "L_R": {
          let r1 = cpu.getRegister(args[1]);
          let lit = args[0];
          cpu.SetRegister("acc", lit - r1);
          break;
        }

        default:
          throw new Error(
            `unknown type in (arethmeticALU->${opcode}): "${type}"`
          );
      }
      return;
    }
    case "DIV": {
      switch (type) {
        case "R_R": {
          let r1 = cpu.getRegister(args[0]);
          let r2 = cpu.getRegister(args[1]);
          cpu.SetRegister("acc", r1 / r2);
          break;
        }
        case "R_L": {
          let r1 = cpu.getRegister(args[0]);
          let lit = args[1];
          cpu.SetRegister("acc", r1 / lit);
          break;
        }
        case "L_R": {
          let r1 = cpu.getRegister(args[1]);
          let lit = args[0];
          cpu.SetRegister("acc", lit / r1);
          break;
        }

        default:
          throw new Error(
            `unknown type in (arethmeticALU->${opcode}): "${type}"`
          );
      }
      return;
    }
    case "MOD": {
      switch (type) {
        case "R_R": {
          let r1 = cpu.getRegister(args[0]);
          let r2 = cpu.getRegister(args[1]);
          cpu.SetRegister("acc", r1 % r2);
          break;
        }
        case "R_L": {
          let r1 = cpu.getRegister(args[0]);
          let lit = args[1];
          cpu.SetRegister("acc", r1 % lit);
          break;
        }
        case "L_R": {
          let r1 = cpu.getRegister(args[1]);
          let lit = args[0];
          cpu.SetRegister("acc", lit % r1);
          break;
        }

        default:
          throw new Error(
            `unknown type in (arethmeticALU->${opcode}): "${type}"`
          );
      }
      return;
    }
    case "INC": {
      switch (type) {
        case "R": {
          let r1 = cpu.getRegister(args[0]);
          cpu.SetRegister(args[0], r1 + 1);
          break;
        }
        default:
          throw new Error(
            `unknown type in (arethmeticALU->${opcode}): "${type}"`
          );
      }
      return;
    }
    case "DEC": {
      switch (type) {
        case "R": {
          let r1 = cpu.getRegister(args[0]);
          cpu.SetRegister(args[0], Math.max(r1 - 1, 0));
          break;
        }
        default:
          throw new Error(
            `unknown type in (arethmeticALU->${opcode}): "${type}"`
          );
      }
      return;
    }

    default:
      throw new Error(`Unknown  instructioon for branchALU: "${opcode}"`);
  }
};
export let interuptionALU = function (
  cpu: CPU,
  opcode: string,
  type: string,
  args: any
) {
  switch (opcode) {
    case "INT": {
      cpu.inInteruption++;
      switch (type) {
        case "L": {
          let num = args[0];
          let state = cpu.checkInteruption(num);
          if (state) return;
          cpu.pushFrame();
          cpu.SetRegister(
            "IP",
            cpu.Mapper.getbit32(cpu.intVector + cpu.MaxLength * num) as number
          );
          break;
        }
        default:
          throw new Error(
            `unknown type in (ineruptionALU->${opcode}): "${type}"`
          );
      }
      return;
    }
    case "RTI": {
      cpu.inInteruption--;
      cpu.popFrame();
      break;
    }

    default:
      throw new Error(`Unknown  instructioon for ineruptionALU: "${opcode}"`);
  }
};
export let structALU = function (
  cpu: any,
  opcode: string,
  type: string,
  args: any
) {
  switch (opcode) {
    case "ASCII": {
      switch (type) {
        case "NA":
          {
            while (true) {
              let letter = cpu.getNbit(8);
              if (letter == 0) break;
            }
          }
          break;

        default:
          throw new Error(`unknown type in (structALU->${opcode}): "${type}"`);
      }
      return;
    }

    default:
      throw new Error(`Unknown  instructioon for structALU: "${opcode}"`);
  }
};
export let IOALU = function (
  cpu: CPU,
  opcode: string,
  type: string,
  args: any
) {
  switch (opcode) {
    case "WR": {
      switch (type) {
        case "M": {
          cpu.push(cpu.getRegister("IP") as number);
          cpu.SetRegister("IP", args[0]);
          let str = "";
          while (true) {
            let letter = cpu.getNbit(8);
            str += String.fromCharCode(letter as number);
            if (letter == 0) break;
          }
          cpu.outputStream += str;
          console.log(str);
          cpu.SetRegister("IP", cpu.pop() as number);
          break;
        }
        case "R": {
          cpu.push(cpu.getRegister("IP") as number);
          cpu.SetRegister("IP", cpu.getRegister(args[0]) as number);
          let str = "";
          while (true) {
            let letter = cpu.getNbit(8);
            str += String.fromCharCode(letter as number);
            if (letter == 0) break;
          }
          cpu.outputStream += str;
          console.log(str);
          cpu.SetRegister("IP", cpu.pop() as number);
          break;
        }

        default:
          throw new Error(`unknown type in (IOALU->${opcode}): "${type}"`);
      }
      return;
    }
    case "WRR": {
      switch (type) {
        case "R": {
          console.log(cpu.getRegister(args[0]));
          break;
        }

        default:
          throw new Error(`unknown type in (IOALU->${opcode}): "${type}"`);
      }
      return;
    }
    case "WNL": {
      cpu.outputStream += "\n";
      break;
    }
    case "INP": {
      switch (type) {
        case "R": {
          while (true) {
            //@ts-ignore
            let res: number = prompt("");
            res *= 1;
            if (!isNaN(res)) {
              cpu.SetRegister(args[0], res);
              break;
            }
          }
        }
      }
      break;
    }

    default:
      throw new Error(`Unknown  instructioon for IOALU: "${opcode}"`);
  }
};
