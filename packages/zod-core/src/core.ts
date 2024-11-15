import type * as err from "./errors.js";
import type * as types from "./types.js";

export type input<T extends $ZodType> = T["_input"];
// T["_input"] extends object
// ? types.Flatten<T["_input"]>
// : T["_input"];
export type output<T extends $ZodType> = T["_output"] extends object
  ? types.Flatten<T["_output"]>
  : T["_output"];
export type {
  output as infer,
  /** @deprecated Use z.output<typeof schema> instead */
  output as Infer,
};

// @ts-expect-error
export interface $Dynamic<T extends object> extends T {}
export class $Dynamic<T extends object> {
  constructor(def: T) {
    Object.assign(this, def);
  }
}

//////////////////////////////////////////////////////////////////////////////

export type $ZodSchemaTypes =
  | "string"
  | "number"
  | "int"
  | "boolean"
  | "bigint"
  | "symbol"
  | "null"
  | "undefined"
  | "void" // merge with undefined?
  | "never"
  | "any"
  | "unknown"
  | "date"
  | "object"
  | "record"
  | "file"
  | "array"
  | "tuple"
  | "union"
  | "intersection"
  | "map"
  | "set"
  | "enum"
  | "literal"
  | "nullable"
  | "optional"
  | "success"
  | "preprocess"
  | "effect"
  | "transform"
  | "default"
  | "catch"
  | "nan"
  | "branded"
  | "pipeline"
  | "readonly"
  | "template_literal"
  | "custom";

export interface $ZodTypeDef {
  type: $ZodSchemaTypes;
  description?: string | undefined;
  error?: err.$ZodErrorMap<never> | undefined;
  checks?: $ZodCheck<never>[];
}

export type $IO<O, I> = { output: O; input: I };
export const BRAND: unique symbol = Symbol("zod_brand");
export type $brand<
  T extends string | number | symbol = string | number | symbol,
> = {
  [BRAND]: { [k in T]: true };
};

export type $Parse<O> = (
  input: unknown,
  ctx?: $ParseContext
) => types.MaybeAsync<O | $ZodFailure>;

// @ts-ignore cast variance
export interface $Zod<out O = unknown, in I = unknown> {
  // standard-schema
  "~standard": number;
  "~types": $IO<this["_output"], this["_input"]>;

  /** @deprecated Internal API, use with caution (not deprecated) */
  _output: O;
  /** @deprecated Internal API, use with caution (not deprecated) */
  _input: I;
  /** @deprecated Internal API, use with caution (not deprecated) */
  _parse(
    input: unknown,
    ctx?: $ParseContext
  ): types.MaybeAsync<O | $ZodFailure>;
  _parse2(input: unknown, ctx?: $ParseContext): types.MaybeAsync<$ZodResult>;
  _parse3(result: $ZodResult3, ctx?: $ParseContext): void | Promise<void>;
  _dev(input: unknown, ctx?: $ParseContext): types.MaybeAsync<O | $ZodFailure>;
}

export type $DiscriminatorMapElement = {
  values: Set<types.Primitive>;
  maps: $DiscriminatorMap[];
};
export type $DiscriminatorMap = Map<PropertyKey, $DiscriminatorMapElement>;
export type $PrimitiveSet = Set<types.Primitive>;
export interface $ZodType<out O = unknown, out I = unknown> extends $Zod<O, I> {
  /** @deprecated Internal API, use with caution (not deprecated) */
  _typecheck(
    input: unknown,
    ctx?: $ParseContext
  ): types.MaybeAsync<O | $ZodFailure>;
  _typecheck2(
    input: unknown,
    ctx?: $ParseContext
  ): types.MaybeAsync<$ZodResult>;
  _typecheck3(result: $ZodResult3, ctx?: $ParseContext): void;
  /** @deprecated Internal API, use with caution (not deprecated) */
  _check(...checks: $ZodCheck<O>[]): this;
  /** @deprecated Internal API, use with caution (not deprecated) */
  _clone(def?: this["_def"]): this;
  /** @deprecated Internal API, use with caution (not deprecated) */
  _traits: Set<string>;
  /** @deprecated Internal API, use with caution (not deprecated) */
  _qout?: "true" | undefined;
  /** @deprecated Internal API, use with caution (not deprecated) */
  _qin?: "true" | undefined;
  /** @deprecated Internal API, use with caution (not deprecated) */
  _disc?: $DiscriminatorMap;
  /** @deprecated Internal API, use with caution (not deprecated) */
  _values?: $PrimitiveSet;
  /** @deprecated Internal API, use with caution (not deprecated) */
  _def: $ZodTypeDef;
  /** @deprecated Internal API, use with caution (not deprecated) */
  _constr: new (
    def: any
  ) => any;
  /** @deprecated Internal API, use with caution (not deprecated) */
  _computed?: object;

  brand<T extends PropertyKey = PropertyKey>(): this & {
    _output: O & $brand<T>;
  };
}

// type asdf = PropertyKey & BRAND<PropertyKey>;

export const $ZodType: $constructor<$ZodType> = $constructor(
  "$ZodType",
  (inst, def) => {
    // Object.assign(inst, def); // copy def into inst
    inst._def = def; // set _def property
    // inst._qin = undefined;
    // inst._qout = undefined;
    inst["~standard"] = 1; // set standard-schema version
    inst._computed = inst._computed || {}; // initialize _computed object

    inst._clone = (_def = def) => {
      return new inst._constr(_def);
    };

    inst._check = (...checks: $ZodCheck[]) => {
      return inst._clone({
        ...inst._def,
        checks: [...(inst._def.checks || []), ...checks],
      });
    };
    inst.brand = () => inst as any;

    const checks = inst._def.checks || [];
    const checkEntries = [...checks.entries()];
    const noChecks = checkEntries.length === 0;
    // console.log({ noChecks });

    // let asyncChecks = false;

    if (noChecks) {
      inst._parse = (...args) => inst._typecheck(...args);
      inst._parse2 = (...args) => inst._typecheck2(...args);
      inst._parse3 = (...args) => inst._typecheck3(...args);
    } else {
      inst._parse = (_input, ctx) => {
        const parseResult = inst._typecheck(_input, ctx);
        let fail!: $ZodFailure;
        let input!: unknown;
        if (failed(parseResult)) {
          fail = parseResult;
          if (parseResult.aborted) return parseResult;
        } else {
          input = parseResult;
        }

        let i = 0;
        for (const check of checks) {
          console.log(`check ${i}`);
          const _checkResult = check.run(input as never);
          if (!_checkResult) continue;
          if (_checkResult instanceof Promise) {
            console.log(`check ${i} is async`);
            return _checkResult.then(async () => {
              const remainingChecks = inst._def.checks!.slice(i);
              for (const check of remainingChecks) {
                let _checkResult = check.run(input as never);
                if (_checkResult instanceof Promise)
                  _checkResult = await _checkResult;
                if (!_checkResult) continue;
                if (_checkResult.override) input = _checkResult.override;
                if (_checkResult.issues) {
                  if (!fail) fail = new $ZodFailure();
                  fail.push(..._checkResult.issues);
                }
                if (_checkResult.abort) {
                  fail.aborted = true;
                  return fail;
                }
              }
              return fail ?? input;
            });
          }

          if (_checkResult.issues) {
            if (!fail) fail = new $ZodFailure();
            fail.push(..._checkResult.issues);
          }
          if (_checkResult.abort) return fail;
          if (_checkResult.override) input = _checkResult.override;

          i++;
        }
        return fail ?? input;
      };
    }
    inst._dev = (...args: [any, any]) => {
      const result = inst._parse(...args);
      console.log(result);
      return result;
    };
  }
);

/////////////////////////////   PARSE   //////////////////////////////

type $ParsePathComponent = PropertyKey;
type $ParsePath = $ParsePathComponent[];
export interface $ParseContext {
  readonly path?: $ParsePath;
  readonly error?: err.$ZodErrorMap<never>;
  readonly includeInputInErrors?: boolean;
}

export type $SyncParseResult<T = unknown> = T | $ZodFailure;
export type $AsyncParseResult<T = unknown> = Promise<$SyncParseResult<T>>;
export type $ParseResult<T> = $SyncParseResult<T> | $AsyncParseResult<T>;

/////////////////////////////   ZODFAILURE   //////////////////////////////

export const RESULT: symbol = Symbol.for("{{zod.result}}");
export interface $ZodResult {
  tag: typeof RESULT;
  issues?: err.$ZodIssueData[];
  aborted?: boolean;
  value?: unknown;
}

export interface $ZodResult3 {
  // tag: typeof RESULT;
  issues: err.$ZodIssueData[];
  value: unknown;
  aborted: boolean;
}
export function $fail(
  issues: err.$ZodIssueData[],
  aborted = false
): $ZodResult {
  return { tag: RESULT, issues, aborted };
}

export function $failed(x: $ZodResult): boolean {
  return x.issues?.length as any;
}

export function $succeed(value: unknown): $ZodResult {
  return { tag: RESULT, issues: [], value };
}

export function isresult(x: $SyncParseResult<unknown>): x is $ZodResult {
  return (x as any)?.tag === RESULT;
}

// function emptyFail
export const FAILURE: symbol = Symbol.for("{{zod.failure}}");

export class $ZodFailure {
  protected "~tag": typeof FAILURE = FAILURE;
  issues: err.$ZodIssueData[];
  aborted: boolean;

  constructor(issues?: err.$ZodIssueData[], aborted?: boolean | undefined) {
    this.issues = issues ?? [];
    this.aborted = !!aborted;
  }

  static from(issues: err.$ZodIssueData[], aborted?: boolean): $ZodFailure {
    return new $ZodFailure(issues, aborted);
  }

  push(...issues: err.$ZodIssueData[]): void {
    this.issues.push(...issues);
  }

  finalize(ctx?: $ParseContext): $ZodError {
    return new $ZodError(
      this.issues.map((iss) => {
        const full = { ...iss } as err.$ZodIssue;
        if (!iss.message) {
          const message =
            ctx?.error?.(iss as never) ??
            iss?.def?.error?.(iss as never) ??
            getConfig().error?.(iss) ??
            defaultErrorMap(iss);
          full.message =
            typeof message === "string" ? message : message?.message!;
        }

        delete full.def;
        if (!ctx?.includeInputInErrors) delete full.input;
        return full;
      })
    );
  }

  // @ts-ignore
  static [Symbol.hasInstance](inst: any) {
    return inst?.["~tag"] === FAILURE;
  }
}

export function finalize(
  issues: err.$ZodIssueData[],
  ctx?: $ParseContext
): $ZodError {
  return new $ZodError(
    issues.map((iss) => {
      const full = { ...iss } as err.$ZodIssue;
      if (!iss.message) {
        const message =
          ctx?.error?.(iss as never) ??
          iss?.def?.error?.(iss as never) ??
          getConfig().error?.(iss) ??
          defaultErrorMap(iss);
        full.message =
          typeof message === "string" ? message : message?.message!;
      }

      delete full.def;
      if (!ctx?.includeInputInErrors) delete full.input;
      return full;
    })
  );
}

// function finalize(data: err.$ZodIssueData, ctx?: $ParseContext): err.$ZodIssue {
//   const iss = { ...data } as err.$ZodIssue;
//   if (!data.message) {
//     const message =
//       ctx?.error?.(data as never) ??
//       data?.def?.error?.(data as never) ??
//       getConfig().error?.(data) ??
//       defaultErrorMap(data);
//     iss.message = typeof message === "string" ? message : message?.message!
//   }
//   delete iss.def;
//   if(!ctx?.includeInputInErrors) delete iss.input;
//   return iss;
// }

export const ZOD_ERROR: symbol = Symbol.for("{{zod.error}}");
export class $ZodError {
  protected "~tag": typeof ZOD_ERROR = ZOD_ERROR;
  public issues: err.$ZodIssue[];
  constructor(issues: err.$ZodIssue[]) {
    this.issues = issues;
  }
}

// Object.defineProperty($ZodFailure, Symbol.hasInstance, {
//   value: (inst: any) => inst?.["~tag"] === FAILURE,
// });

// export function emptyFail(ctx?: $ParseContext): $ZodFailure {
//   return new $ZodFailure([]);
// }

export function mergeFails(
  a: $ZodFailure,
  b: $ZodFailure,
  path?: PropertyKey
): $ZodFailure {
  // console.log({ a, b });
  if (!b.issues) return a;
  const issues = [...a.issues];
  for (const iss of b.issues) {
    if (path) iss.path = [path, ...(iss.path ?? [])];
    issues.push(iss);
  }
  // console.log({ issues });
  return new $ZodFailure(issues);
}

// export function mergeFails(
//   a: $ZodFailure,
//   b: $ZodFailure,
//   path?: PropertyKey
// ): $ZodFailure {
//   if (!b.issues) return a;
//   const issues = [...a.issues];
//   for (const iss of b.issues) {
//     if (path) iss.path = [path, ...iss.path];
//     a.issues.push(iss);
//   }
//   return new $ZodFailure(issues, a.ctx);
// }

export function prefixIssues(
  path: PropertyKey,
  issues: err.$ZodIssueData[]
): err.$ZodIssueData[] {
  return issues.map((iss) => {
    iss.path = [path, ...(iss.path ?? [])];
    return iss;
  });
}

// export function addIssues(
//   fail: $ZodFailure,
//   ...issues: err.$ZodIssueData[]
// ): $ZodFailure {
//   fail.issues.push(...issues);
//   return fail;
// }

// export function fail(
//   issue: string | err.$ZodIssueData,
//   schema?: { error?: err.$ZodErrorMap<never> | undefined },
//   ctx?: $ParseContext
// ): $ZodFailure {
//   return typeof issue === "string"
//     ? new $ZodFailure(
//         [
//           {
//             code: "custom",
//             level: "error",
//             message: issue,
//             origin: "custom",
//             path: [],
//           },
//         ],
//         ctx
//       )
//     : new $ZodFailure([makeIssue(issue, schema, ctx)], undefined);
// }

export const makeIssue = (
  issueData: err.$ZodIssueData,
  // schema?: { error?: err.$ZodErrorMap<never> | undefined },
  ctx?: $ParseContext
): err.$ZodIssue => {
  const fullPath = ctx?.path
    ? issueData.path
      ? [...ctx.path, ...issueData.path]
      : ctx.path
    : issueData.path
      ? issueData.path
      : [];

  const fullIssue = {
    ...issueData,
    // level: issueData.level ?? "error",
    path: fullPath,
  };

  if (issueData.message) return fullIssue as err.$ZodIssue;
  const _message: any =
    ctx?.error?.(fullIssue as never) ??
    issueData?.def?.error?.(fullIssue as never) ??
    getConfig().error?.(fullIssue) ??
    defaultErrorMap(fullIssue);
  fullIssue.message = _message.message ?? _message;
  return fullIssue as err.$ZodIssue;
};

export function failed(x: $SyncParseResult<unknown>): x is $ZodFailure {
  return (x as any)?.["~tag"] === FAILURE;
}

// export function aborted(x: $ZodFailure): x is $ZodFailure {
//   return !!x.aborted;
// }

export function succeeded<T>(x: any): x is T {
  return x?.["~tag"] !== FAILURE;
}

//////////////////////////////   ZodFail   ///////////////////////////////////////

// export type $ZodFail = {
//   "~tag": typeof FAILURE;
//   issues: err.$ZodIssueData[];
//   aborted?: boolean;
// };

// export function fail(issues: err.$ZodIssueData[]): $ZodFail {
//   return {
//     "~tag": FAILURE,
//     issues,
//   };
// }

//////////////////////////////   ERROR MAPS   ///////////////////////////////////////

import defaultErrorMap from "./locales/en.js";
interface ZodConfig {
  error: err.$ZodErrorMap;
}

const globalZodConfig: ZodConfig = {
  error: defaultErrorMap,
};

export function configure(config: Partial<ZodConfig>): void {
  Object.assign(globalZodConfig, config);
}

export function getConfig(): ZodConfig {
  return globalZodConfig;
}

export { defaultErrorMap };

//////////////////////////////   CHECKS   ///////////////////////////////////////

export interface $ZodCheckCtx<out T> {
  input: T;
  fail?: $ZodFailure | undefined;
  addIssue(
    issue: err.$ZodIssueData,
    schema?: { error?: err.$ZodErrorMap<never> | undefined }
  ): void;
}

export interface $ZodCheckDef {
  check: string;
  error?: err.$ZodErrorMap<never> | undefined;
}

// @ts-ignore cast variance
export interface $ZodCheck<in T = never> {
  _def: $ZodCheckDef;
  run: (input: T) => types.MaybeAsync<void | $ZodCheckResult<T>>;
}

export type $ZodCheckResult<O = unknown> = {
  override?: O;
  issues?: err.$ZodIssueData[];
  abort?: boolean;
};

export const $ZodCheck: $constructor<$ZodCheck<any>> = $constructor(
  "$ZodCheck",
  (inst, def) => {
    inst._def = def;
  }
);

// export function makeCheckCtx<T>(
//   input: T,
//   ctx: $ParseContext | undefined,
//   fail: $ZodFailure | undefined
// ): $ZodCheckCtx<T> {
//   if (fail) {
//     const checkCtx: $ZodCheckCtx<T> = {
//       input,
//       fail,
//       addIssue(iss, schema) {
//         this.fail!.addIssue(iss, schema); //.bind(fail),
//       },
//     };
//     return checkCtx;
//   }

//   const checkCtx: $ZodCheckCtx<T> = {
//     input,
//     addIssue(
//       issue: err.$ZodIssueData,
//       schema?: { error?: err.$ZodErrorMap<never> | undefined }
//     ) {
//       if (!checkCtx.fail) {
//         const fail = new $ZodFailure([]);
//         // fail.addIssue(issue, schema);
//         checkCtx.fail = fail;
//         // return;
//       }
//       checkCtx.fail.addIssue(issue, schema);
//     },
//   };
//   return checkCtx;
// }

//////////////////////////////   CONSTRUCTORS   ///////////////////////////////////////
type Trait = { _def: unknown };
export interface $constructor<T extends Trait> {
  new (def: T["_def"]): T;
  init(inst: T, def: T["_def"]): void;
}

export /*@__NO_SIDE_EFFECTS__*/ function $constructor<
  T extends Trait,
  D = T["_def"],
>(name: string, initializer: (inst: T, def: D) => void): $constructor<T> {
  class _ {
    constructor(def: D) {
      _.init(this as any as T, def);
    }
    static init(inst: T, def: D) {
      initializer(inst, def);
      (inst as any)._constr = _;
      (inst as any)._def = def;
      (inst as any)._traits ??= new Set();
      (inst as any)._traits.add(name);
    }
    static [Symbol.hasInstance](inst: any) {
      return inst?._traits?.has(name);
    }
  }
  Object.defineProperty(_, "name", { value: name });
  return _ as any;
}
