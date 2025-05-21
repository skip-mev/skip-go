import { api } from "../utils/generateApi";

export const bridges = api({
  methodName: "bridges",
  path: "/v2/info/bridges",
  transformResponse: (response) => response.bridges,
});
