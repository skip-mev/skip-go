export type Letter<S extends string> = S extends
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z"
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z"
  ? S
  : never;

export type SnakeKey<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Capitalize<Letter<T>> ? "_" : ""}${Lowercase<T>}${SnakeKey<U>}`
  : S;

export type CamelKey<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<CamelKey<U>>}`
  : S;

export type Snake<T> = T extends (infer U)[]
  ? Snake<U>[]
  : T extends object
    ? {
        [K in keyof T as K extends string ? SnakeKey<K> : never]: Snake<T[K]>;
      }
    : T;

export type Camel<T> = T extends (infer U)[]
  ? Camel<U>[]
  : T extends object
    ? {
        [K in keyof T as K extends string ? CamelKey<K> : never]: Camel<T[K]>;
      }
    : T;

export function toSnake<T extends object>(obj: T): Snake<T> {
  return convertKeys(obj, (key) => key.replace(/([A-Z])/g, "_$1").toLowerCase());
}

export function toCamel<T extends object>(obj: T): Camel<T> {
  return convertKeys(obj, (key) => key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()));
}

export function convertKeys<T extends object>(obj: T, convertKey: (key: string) => string): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeys(item, convertKey)) as any;
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      acc[convertKey(key)] = convertKeys((obj as any)[key], convertKey);
      return acc;
    }, {} as any);
  } else {
    return obj;
  }
}
