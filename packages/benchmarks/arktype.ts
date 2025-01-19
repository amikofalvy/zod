import { makeData, randomString } from "./benchUtil.js";
import { metabench } from "./metabench.js";

import { type } from "arktype";
import * as z from "zod";

const schema = z.object({
  a: z.string(),
  b: z.string(),
  c: z.string(),
});

const atschema = type({
  a: "string",
  b: "string",
  c: "string",
});

const DATA = makeData(1000, () => ({
  a: randomString(10),
  b: randomString(10),
  c: randomString(10),
}));

console.log(schema.parse(DATA[0]));
console.log(atschema(DATA[0]));
console.log(atschema(DATA[0]) === DATA[0]);

const bench = metabench("zod vs arktype", {
  zod4() {
    for (const _ of DATA) schema.parse(_);
  },
  arktype() {
    for (const _ of DATA) atschema(_);
  },
  baseline() {
    for (const _ of DATA) {
      typeof _ === "object" &&
        _ !== null &&
        typeof _.a === "string" &&
        typeof _.b === "string" &&
        typeof _.c === "string";
    }
  },
});

await bench.run();
