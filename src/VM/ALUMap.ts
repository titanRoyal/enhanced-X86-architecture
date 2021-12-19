export default {
    bitwise: {
        XOR: true,
        AND: true,
        OR: true,
        LSH: true,
        RSH: true,
        NOT: true,
        aluNumber: 0x1
    },
    arithmetic: {
        ADD: true,
        SUB: true,
        INC: true,
        DEC: true,
        MULT: true,
        DIV: true,
        MOD: true,
        aluNumber: 0x2
    },
    stack: {
        PSH: true,
        POP: true,
        aluNumber: 0x3
    },
    structure: {
        INLINADATA: true,
        STR: true,
        CONST: true,
        aluNumber: 0x4
    },
    branching: {
        JEQ: true,
        JMP: true,
        JNE: true,
        JLT: true,
        JLE: true,
        JGT: true,
        JGE: true,
        HLT: true,
        aluNumber: 0x5
    },
    functionCal: {
        CAL: true,
        RET: true,
        aluNumber: 0x6
    },
    dataMov: {
        MOV: true,
        aluNumber: 0x7
    },
    Interuption: {
        INT: true,
        RTI: true,
        aluNumber: 0x8
    },
    IO: {
        WR: true,
        WNL: true,
        aluNumber: 0x9
    },
}