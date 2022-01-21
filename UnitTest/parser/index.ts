import Parser from "../../src/parser";

import fs from "fs";

let input = fs.readFileSync("../input.asm", "utf-8");

let result = Parser.run(input);

fs.writeFileSync("output.json", JSON.stringify(result));

console.log(result);
