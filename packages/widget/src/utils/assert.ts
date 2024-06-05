const ignoreSymbol = Symbol("ignore");

export function ignore(): never {
  throw ignoreSymbol;
}

export function raise(message?: string, opts?: ErrorOptions): never {
  throw new Error(message, opts);
}
