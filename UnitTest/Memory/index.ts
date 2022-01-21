import {
    Memory
} from "../../src/VM/Memory";


let mem = new Memory(10);

let add = [8, 1, 1]


add.forEach(d => {
    let i = mem.alloc(d);
    console.log("////////////////////// " + i);
})