import { makeData, randomString } from "./benchUtil.js";
import { metabench } from "./metabench.js";

import * as z from "zod";

const schema = z.object({
  a: z.string(),
  b: z.string(),
  c: z.string(),
});

const DATA = makeData(1000, () => ({
  a: randomString(10),
  b: randomString(10),
  c: randomString(10),
}));

// console.log(z.parse(schema, DATA[0]));
console.log(schema.parse(DATA[0]));
// console.log(z.parse2(schema, DATA[0]));
console.log(schema.parse2(DATA[0]));

// console.log(z.parse2(schema, DATA[0]));
// console.log(z.parse3(schema, DATA[0]));

const bench = metabench("AB test: objects", {
  _parse() {
    for (const _ of DATA) schema.parse(_);
  },
  _parse2() {
    for (const _ of DATA) schema.parse2(_);
  },

  // _parse3() {
  //   for (const _ of DATA) z.parse3(schema, _);
  // },
});

await bench.run();
