export type Primitive =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | null
  | undefined
  | Date
  | CallableFunction;

/** Build a union of valid dot-path strings for T */
export type Path<T> = T extends Primitive
  ? never
  : {
      [K in keyof T & string]: T[K] extends Primitive
        ? K
        : K | `${K}.${Path<T[K]>}`;
    }[keyof T & string];

/** Resolve the value type at a given path */
export type PathValue<
  T,
  P extends string,
> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;
