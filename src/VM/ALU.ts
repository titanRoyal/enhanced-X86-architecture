export let movALU = function (cpu: any, opcode: string, type: string, args: any) {
    switch (opcode) {
        case "MOV": {
            switch (type) {
                // MEM_REG
                // LIT_REG_REG
                // REG_PTR_REG
                // LIT_OFF_REG
                // REG_REG
                // LIT_REG
                // REG_MEM
                // LIT_MEM
                case "L_R":
                    cpu.SetRegister(args[1], args[0])
                    break;
                case "L_M":
                    cpu.Mapper.setNbit(args[1], args[0]);
                    break;
                case "R_R":
                    cpu.SetRegister(args[1], cpu.getRegister(args[0]))
                    break;
                case "R_M":
                    cpu.Mapper.setbit32(args[1], cpu.getRegister(args[0]))
                    break;
                case "M_R":
                    cpu.SetRegister(args[1], cpu.Mapper.getbit32(args[0]))
                    break;
                case "L_O_R":
                    throw "instruction not implemented yet"
                    break;
                case "R_M_R":
                    throw "instruction not implemented yet"
                    break;
                case "L_R_R":
                    throw "instruction not implemented yet"
                    break;

                default:
                    throw `unknown type in (movALU->${opcode}): "${type}"`
            }
        }
        break;

    default:
        throw `Unknown  instructioon for movALU: "${opcode}"`
    }
}
export let stackALU = function (cpu: any, opcode: string, type: string, args: any) {
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
                    throw `unknown type in (stackALU->${opcode}): "${type}"`
            }
            return;
        }
        case "POP": {
            switch (type) {
                case "R":
                    cpu.SetRegister(args[0], cpu.pop())
                    break;

                default:
                    throw `unknown type in (stackALU->${opcode}): "${type}"`
            }
            return;
        }


        default:
            throw `Unknown  instructioon for stackALU: "${opcode}"`
    }
}
export let fnCalALU = function (cpu: any, opcode: string, type: string, args: any) {
    switch (opcode) {
        case "CAL": {
            switch (type) {
                case "R":
                    cpu.pushFrame();
                    cpu.SetRegister("IP", cpu.getRegister(args[0]))
                    break;
                case "L":
                    cpu.pushFrame();
                    cpu.SetRegister("IP", args[0])
                    break;
                case "M":
                    cpu.pushFrame();
                    cpu.SetRegister("IP", args[0])
                    break;

                default:
                    throw `unknown type in (fnCalALU->${opcode}): "${type}"`
            }
            return;
        }
        case "RET": {
            switch (type) {
                case "NA":
                    cpu.popFrame();
                    break;

                default:
                    throw `unknown type in (fnCalALU->${opcode}): "${type}"`
            }
            return;
        }


        default:
            throw `Unknown  instructioon for fnCalALU: "${opcode}"`
    }
}
export let bitwiseALU = function (cpu: any, opcode: string, type: string, args: any) {
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
                    throw `unknown type in (bitwiseALU->${opcode}): "${type}"`
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
                    throw `unknown type in (bitwiseALU->${opcode}): "${type}"`
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
                    throw `unknown type in (bitwiseALU->${opcode}): "${type}"`
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
                    throw `unknown type in (bitwiseALU->${opcode}): "${type}"`
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
                    throw `unknown type in (bitwiseALU->${opcode}): "${type}"`
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
                    throw `unknown type in (bitwiseALU->${opcode}): "${type}"`
            }
            return;
        }

        default:
            throw `Unknown  instructioon for stackALU: "${opcode}"`
    }
}
export let branchALU = function (cpu: any, opcode: string, type: string, args: any) {
    switch (opcode) {
        case "JEQ": {
            switch (type) {
                case "R_M": {
                    let acc = cpu.getRegister("acc")
                    let r1 = cpu.getRegister(args[0]);
                    if (r1 == acc) cpu.SetRegister("IP", args[1]);
                    break;
                }
                case "L_M": {
                    let acc = cpu.getRegister("acc")
                    let lit = args[0];
                    if (lit == acc) cpu.SetRegister("IP", args[1]);
                    break;
                }

                default:
                    throw `unknown type in (branchALU->${opcode}): "${type}"`
            }
            return;
        }
        case "JNE": {
            switch (type) {
                case "R_M": {
                    let acc = cpu.getRegister("acc")
                    let r1 = cpu.getRegister(args[0]);
                    if (r1 != acc) cpu.SetRegister("IP", args[1]);
                    break;
                }
                case "L_M": {
                    let acc = cpu.getRegister("acc")
                    let lit = args[0];
                    if (lit != acc) cpu.SetRegister("IP", args[1]);
                    break;
                }

                default:
                    throw `unknown type in (branchALU->${opcode}): "${type}"`
            }
            return;
        }
        case "JGT": {
            switch (type) {
                case "R_M": {
                    let acc = cpu.getRegister("acc")
                    let r1 = cpu.getRegister(args[0]);
                    if (r1 > acc) cpu.SetRegister("IP", args[1]);
                    break;
                }
                case "L_M": {
                    let acc = cpu.getRegister("acc")
                    let lit = args[0];
                    if (lit > acc) cpu.SetRegister("IP", args[1]);
                    break;
                }

                default:
                    throw `unknown type in (branchALU->${opcode}): "${type}"`
            }
            return;
        }
        case "JGE": {
            switch (type) {
                case "R_M": {
                    let acc = cpu.getRegister("acc")
                    let r1 = cpu.getRegister(args[0]);
                    if (r1 >= acc) cpu.SetRegister("IP", args[1]);
                    break;
                }
                case "L_M": {
                    let acc = cpu.getRegister("acc")
                    let lit = args[0];
                    if (lit >= acc) cpu.SetRegister("IP", args[1]);
                    break;
                }

                default:
                    throw `unknown type in (branchALU->${opcode}): "${type}"`
            }
            return;
        }
        case "JLT": {
            switch (type) {
                case "R_M": {
                    let acc = cpu.getRegister("acc")
                    let r1 = cpu.getRegister(args[0]);
                    if (r1 < acc) cpu.SetRegister("IP", args[1]);
                    break;
                }
                case "L_M": {
                    let acc = cpu.getRegister("acc")
                    let lit = args[0];
                    if (lit < acc) cpu.SetRegister("IP", args[1]);
                    break;
                }

                default:
                    throw `unknown type in (branchALU->${opcode}): "${type}"`
            }
            return;
        }
        case "JLE": {
            switch (type) {
                case "R_M": {
                    let acc = cpu.getRegister("acc")
                    let r1 = cpu.getRegister(args[0]);
                    if (r1 <= acc) cpu.SetRegister("IP", args[1]);
                    break;
                }
                case "L_M": {
                    let acc = cpu.getRegister("acc")
                    let lit = args[0];
                    if (lit <= acc) cpu.SetRegister("IP", args[1]);
                    break;
                }

                default:
                    throw `unknown type in (branchALU->${opcode}): "${type}"`
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
                    throw `unknown type in (branchALU->${opcode}): "${type}"`
            }
            return;
        }


        default:
            throw `Unknown  instructioon for branchALU: "${opcode}"`
    }
}
export let arethmeticALU = function (cpu: any, opcode: string, type: string, args: any) {
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
                    let lit = args[1]
                    cpu.SetRegister("acc", r1 + lit);
                    break;
                }
                case "L_R": {
                    let r1 = cpu.getRegister(args[1]);
                    let lit = args[0]
                    cpu.SetRegister("acc", r1 + lit);
                    break;
                }

                default:
                    throw `unknown type in (arethmeticALU->${opcode}): "${type}"`
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
                    let lit = args[1]
                    cpu.SetRegister("acc", r1 * lit);
                    break;
                }
                case "L_R": {
                    let r1 = cpu.getRegister(args[1]);
                    let lit = args[0]
                    cpu.SetRegister("acc", r1 * lit);
                    break;
                }

                default:
                    throw `unknown type in (arethmeticALU->${opcode}): "${type}"`
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
                    let lit = args[1]
                    cpu.SetRegister("acc", r1 - lit);
                    break;
                }
                case "L_R": {
                    let r1 = cpu.getRegister(args[1]);
                    let lit = args[0]
                    cpu.SetRegister("acc", lit - r1);
                    break;
                }

                default:
                    throw `unknown type in (arethmeticALU->${opcode}): "${type}"`
            }
            return;
        }
        case "DIV": {
            switch (type) {
                case "R_R": {
                    let r1 = cpu.getRegister(args[0]);
                    let r2 = cpu.getRegister(args[1]);
                    cpu.SetRegister("acc", Math.floor(r1 / r2));
                    break;
                }
                case "R_L": {
                    let r1 = cpu.getRegister(args[0]);
                    let lit = args[1]
                    cpu.SetRegister("acc", Math.floor(r1 / lit));
                    break;
                }
                case "L_R": {
                    let r1 = cpu.getRegister(args[1]);
                    let lit = args[0]
                    cpu.SetRegister("acc", Math.floor(lit / r1));
                    break;
                }

                default:
                    throw `unknown type in (arethmeticALU->${opcode}): "${type}"`
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
                    let lit = args[1]
                    cpu.SetRegister("acc", r1 % lit);
                    break;
                }
                case "L_R": {
                    let r1 = cpu.getRegister(args[1]);
                    let lit = args[0]
                    cpu.SetRegister("acc", lit % r1);
                    break;
                }

                default:
                    throw `unknown type in (arethmeticALU->${opcode}): "${type}"`
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
                    throw `unknown type in (arethmeticALU->${opcode}): "${type}"`
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
                    throw `unknown type in (arethmeticALU->${opcode}): "${type}"`
            }
            return;
        }



        default:
            throw `Unknown  instructioon for branchALU: "${opcode}"`
    }
}
export let interuptionALU = function (cpu: any, opcode: string, type: string, args: any) {
    switch (opcode) {
        case "INT": {
            switch (type) {
                case "L": {

                    let num = args[0];
                    if (!cpu.checkInteruption(num)) {
                        cpu.makeInteruption(num);
                        cpu.pushFrame();
                    }
                    cpu.SetRegister("IP", cpu.Mapper.getbit32(cpu.intVector + cpu.MaxLength * num));
                    break;
                }
                default:
                    throw `unknown type in (ineruptionALU->${opcode}): "${type}"`
            }
            return;
        }
        case "RTI": {
            cpu.popFrame();
            break;
        }


        default:
            throw `Unknown  instructioon for ineruptionALU: "${opcode}"`
    }
}
export let structALU = function (cpu: any, opcode: string, type: string, args: any) {
    switch (opcode) {
        case "STR": {
            switch (type) {
                case "NA": {
                    while (true) {
                        let letter = cpu.getNbit(8);
                        if (letter == 0) break;
                    }
                }
                break;

            default:
                throw `unknown type in (structALU->${opcode}): "${type}"`
            }
            return;
        }


        default:
            throw `Unknown  instructioon for structALU: "${opcode}"`
    }
}
export let IOALU = function (cpu: any, opcode: string, type: string, args: any) {
    switch (opcode) {
        case "WR": {
            switch (type) {
                case "M": {
                    cpu.push(cpu.getRegister("IP"))
                    cpu.SetRegister("IP", args[0])
                    let str = "";
                    while (true) {
                        let letter = cpu.getNbit(8);
                        str += String.fromCharCode(letter);
                        if (letter == 0) break;
                    }
                    cpu.outputStream += str;
                    console.log(cpu.outputStream)
                    cpu.SetRegister("IP", cpu.pop());
                    break;
                }
                case "R": {
                    // cpu.outputStream += String(cpu.getRegister(args[0]));
                    // console.log(cpu.outputStream)
                    cpu.push(cpu.getRegister("IP"))
                    cpu.SetRegister("IP", cpu.getRegister(args[0]))
                    let str = "";
                    while (true) {
                        let letter = cpu.getNbit(8);
                        str += String.fromCharCode(letter);
                        if (letter == 0) break;
                    }
                    cpu.outputStream += str
                    console.log(cpu.outputStream)
                    cpu.SetRegister("IP", cpu.pop());
                    break;
                }

                default:
                    throw `unknown type in (IOALU->${opcode}): "${type}"`
            }
            return;
        }
        case "WNL": {
            cpu.outputStream += "\n";
            break;
        }


        default:
            throw `Unknown  instructioon for IOALU: "${opcode}"`
    }
}