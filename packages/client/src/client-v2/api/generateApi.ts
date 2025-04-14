import { Api } from "src/types/swaggerTypes";
import { Camel } from "../convert";
import { createRequest, OnSuccessCallback } from "../requestClient";

// ✅ Get instance type of the API class
type ApiInstance = InstanceType<typeof Api>;

/* --------------------------------------------------
 🧠 1. Extract method keys from the instance
-------------------------------------------------- */

// Function-only keys
type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

// Keys of methods that return { data: ... }
type ValidApiMethodKeys = {
  [K in FunctionKeys<ApiInstance>]: Awaited<
    ReturnType<ApiInstance[K]>
  > extends { data: unknown }
    ? K
    : never;
}[FunctionKeys<ApiInstance>];

/* --------------------------------------------------
 🧠 2. Extract param and data return types
-------------------------------------------------- */

// Params: take first argument, convert to camelCase, make it non-null
type MethodParams<K extends ValidApiMethodKeys> = NonNullable<
  Camel<Parameters<ApiInstance[K]>[0]>
>;

type MethodReturn<K extends ValidApiMethodKeys> = Camel<
  Awaited<ReturnType<ApiInstance[K]>> extends { data: infer D }
    ? D extends object
      ? D
      : never
    : never
>;

/* --------------------------------------------------
 ⚙️ 3. Factory to generate API functions
-------------------------------------------------- */

export function api<K extends ValidApiMethodKeys>(
  methodName: K,
  path: string,
  callback?: OnSuccessCallback<MethodReturn<K>, MethodParams<K>>,
) {
  type Params = MethodParams<K>;
  type Response = MethodReturn<K>;

  const request = (options: Params) => {
    return createRequest<Params, Response>(path, options, callback).request;
  };

  const requestWithCancel = (options: Params) => {
    return createRequest<Params, Response>(path, options, callback);
  };

  return {
    request,
    requestWithCancel,
  };
}
