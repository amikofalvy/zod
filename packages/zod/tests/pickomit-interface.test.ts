import { expect, expectTypeOf, test } from "vitest";
import * as z from "zod";

const fish = z.interface({
  name: z.string(),
  age: z.number(),
  nested: z.interface({}),
});

test("pick type inference", () => {
  const nameonlyFish = fish.pick({ name: true });
  type nameonlyFish = z.infer<typeof nameonlyFish>;
  expectTypeOf<nameonlyFish>().toEqualTypeOf<{ name: string }>();
});

test("pick", () => {
  fish.pick({ name: true }).parse({ name: "bob" });
  fish.pick({ name: true }).parse({ name: "12" });
  fish.pick({ name: true }).parse({ name: "bob", age: 12 });
  fish.pick({ age: true }).parse({ age: 12 });

  // @ts-expect-error checking runtime picks `name` only.
  const b = fish.pick({ name: true, age: false });
  b.parse({ name: "bob" });
  b.parse({ name: "bob", age: 12 });
  expect(() => b.parse({ age: 12 })).toThrow();
});

test("pick parse - fail", () => {
  fish.pick({ name: true }).parse({ name: "12" } as any);
  fish.pick({ name: true }).parse({ name: "bob", age: 12 } as any);
  fish.pick({ age: true }).parse({ age: 12 } as any);

  const nameonlyFish = fish.pick({ name: true }).strict();
  const bad1 = () => nameonlyFish.parse({ name: 12 } as any);
  const bad2 = () => nameonlyFish.parse({ name: "bob", age: 12 } as any);
  const bad3 = () => nameonlyFish.parse({ age: 12 } as any);

  // @ts-expect-error checking runtime picks `name` only.
  const anotherNameonlyFish = fish.pick({ name: true, age: false }).strict();
  const bad4 = () => anotherNameonlyFish.parse({ name: "bob", age: 12 } as any);

  expect(bad1).toThrow();
  expect(bad2).toThrow();
  expect(bad3).toThrow();
  expect(bad4).toThrow();
});

test("pick - remove optional", () => {
  const schema = z.interface({ a: z.string, "b?": z.string() });
  expect(schema.pick({ a: true })._def.optional).toEqual([]);
  expect(schema.pick({ b: true })._def.optional).toEqual(["b"]);
});

test("omit type inference", () => {
  const nonameFish = fish.omit({ name: true });
  type nonameFish = z.infer<typeof nonameFish>;

  expectTypeOf<nonameFish>().toEqualTypeOf<{ age: number; nested: object }>();
});

test("omit parse - success", () => {
  const nonameFish = fish.omit({ name: true });
  nonameFish.parse({ age: 12, nested: {} });

  // @ts-expect-error checking runtime omits `name` only.
  const anotherNonameFish = fish.omit({ name: true, age: false });
  anotherNonameFish.parse({ age: 12, nested: {} });
});

test("omit parse - fail", () => {
  const nonameFish = fish.omit({ name: true });
  const bad1 = () => nonameFish.parse({ name: 12 } as any);
  const bad2 = () => nonameFish.parse({ age: 12 } as any);
  const bad3 = () => nonameFish.parse({} as any);

  // @ts-expect-error checking runtime omits `name` only.
  const anotherNonameFish = fish.omit({ name: true, age: false });
  const bad4 = () => anotherNonameFish.parse({ nested: {} } as any);

  expect(bad1).toThrow();
  expect(bad2).toThrow();
  expect(bad3).toThrow();
  expect(bad4).toThrow();
});

test("omit - remove optional", () => {
  const schema = z.interface({ a: z.string(), "b?": z.string() });
  expect(schema.omit({ a: true })._def.optional).toEqual(["b"]);
  expect(schema.omit({ b: true })._def.optional).toEqual([]);
});

test("nonstrict inference", () => {
  const laxfish = fish.pick({ name: true }).catchall(z.any());
  type laxfish = z.infer<typeof laxfish>;
  expectTypeOf<laxfish>().toEqualTypeOf<{ name: string; [k: string]: any }>();
});

test("nonstrict parsing - pass", () => {
  const laxfish = fish.loose().pick({ name: true });
  laxfish.parse({ name: "asdf", whatever: "asdf" });
  laxfish.parse({ name: "asdf", age: 12, nested: {} });
});

test("nonstrict parsing - fail", () => {
  const laxfish = fish.loose().pick({ name: true });
  const bad = () => laxfish.parse({ whatever: "asdf" } as any);
  expect(bad).toThrow();
});

test("pick/omit/required/partial - do not allow unknown keys", () => {
  const schema = z.interface({
    name: z.string(),
    age: z.number(),
  });

  // @ts-expect-error
  expect(() => schema.pick({ $unknown: true })).toThrow();
  // @ts-expect-error
  expect(() => schema.omit({ $unknown: true })).toThrow();
  // @ts-expect-error
  expect(() => schema.required({ $unknown: true })).toThrow();
  // @ts-expect-error
  expect(() => schema.partial({ $unknown: true })).toThrow();
});
