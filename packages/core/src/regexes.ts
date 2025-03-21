export const cuid: RegExp = /^[cC][^\s-]{8,}$/;
export const cuid2: RegExp = /^[0-9a-z]+$/;
export const ulid: RegExp = /^[0-9A-HJKMNP-TV-Z]{26}$/;
export const xid: RegExp = /^[0-9a-vA-V]{20}$/;
export const ksuid: RegExp = /^[A-Za-z0-9]{27}$/;
export const nanoid: RegExp = /^[a-zA-Z0-9_-]{21}$/;

/** ISO 8601-1 duration regex. Does not support the 8601-2 extensions like negative durations or fractional/negative components. */
export const duration: RegExp =
  /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;

/** Implements ISO 8601-2 extensions like explicit +- prefixes, mixing weeks with other units, and fractional/negative components. */
export const extendedDuration: RegExp =
  /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;

/** A regex for any UUID-like identifier: 8-4-4-4-12 hex pattern */
export const guid: RegExp = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;

/** Returns a regex for validating an RFC 4122 UUID.
 *
 * @param version Optionally specify a version 1-8. If no version is specified, all versions are supported. */
export const uuid = (version?: number | undefined): RegExp => {
  if (!version)
    return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$/;
  return new RegExp(
    `^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`
  );
};
export const uuid4: RegExp = uuid(4);
export const uuid6: RegExp = uuid(6);
export const uuid7: RegExp = uuid(7);

/** Practical email validation */
export const email: RegExp =
  /^(?!\.)(?!.*\.\.)[A-Za-z0-9_'+\-]+(?:\.[A-Za-z0-9_'+\-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9\-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;

/** Equivalent to the HTML5 input[type=email] validation implemented by browsers. Source: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email */
export const html5Email: RegExp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/** The classic emailregex.com regex for RFC 5322-compliant emails */
export const rfc5322Email =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/** A loose regex that allows Unicode characters, enforces length limits, and that's about it. */
export const unicodeEmail = /^[^\s@"]{1,64}@[^\s@]{1,255}$/u;

export const browserEmail: RegExp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
// from https://thekevinscott.com/emojis-in-javascript/#writing-a-regular-expression
export const _emoji = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
export function emoji(): RegExp {
  return new RegExp(_emoji, "u");
}

export const ipv4: RegExp =
  /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
export const ipv6: RegExp =
  /^(([a-fA-F0-9]{1,4}:){7}|::([a-fA-F0-9]{1,4}:){0,6}|([a-fA-F0-9]{1,4}:){1}:([a-fA-F0-9]{1,4}:){0,5}|([a-fA-F0-9]{1,4}:){2}:([a-fA-F0-9]{1,4}:){0,4}|([a-fA-F0-9]{1,4}:){3}:([a-fA-F0-9]{1,4}:){0,3}|([a-fA-F0-9]{1,4}:){4}:([a-fA-F0-9]{1,4}:){0,2}|([a-fA-F0-9]{1,4}:){5}:([a-fA-F0-9]{1,4}:){0,1})([a-fA-F0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/;
export const ip: RegExp = new RegExp(`(${ipv4.source})|(${ipv6.source})`);

// https://stackoverflow.com/questions/7860392/determine-if-string-is-in-base64-using-javascript
export const base64: RegExp = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

// based on https://stackoverflow.com/questions/106179/regular-expression-to-match-dns-hostname-or-ip-address
export const hostname: RegExp =
  /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)+([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/;

// https://blog.stevenlevithan.com/archives/validate-phone-number#r4-3 (regex sans spaces)
export const e164: RegExp = /^\+(?:[0-9]){6,14}[0-9]$/;

const dateSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
export const date: RegExp = new RegExp(`^${dateSource}$`);

function timeSource(args: { precision?: number | null }) {
  // let regex = `\\d{2}:\\d{2}:\\d{2}`;
  let regex = `([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d`;

  if (args.precision) {
    regex = `${regex}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    regex = `${regex}(\\.\\d+)?`;
  }
  return regex;
}
export function time(args: {
  precision?: number | null;
}): RegExp {
  return new RegExp(`^${timeSource(args)}$`);
}

// Adapted from https://stackoverflow.com/a/3143231
export function datetime(args: {
  precision?: number | null;
  offset?: boolean;
  local?: boolean;
}): RegExp {
  let regex = `${dateSource}T${timeSource(args)}`;

  const opts: string[] = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset) opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}

export const string = (params?: { minimum?: number; maximum?: number }): RegExp => {
  const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
  return new RegExp(`^${regex}$`);
};

export const bigint: RegExp = /^\d+n?$/;
export const integer: RegExp = /^\d+$/;
export const number: RegExp = /^-?\d+(?:\.\d+)?/i;
export const boolean: RegExp = /true|false/i;
const _null: RegExp = /null/i;
export { _null as null };
const _undefined: RegExp = /undefined/i;
export { _undefined as undefined };

// regex for string with no uppercase letters
export const lowercase: RegExp = /^[^A-Z]*$/;
// regex for string with no lowercase letters
export const uppercase: RegExp = /^[^a-z]*$/;
