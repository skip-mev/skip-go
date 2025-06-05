import { api } from "../utils/generateApi";

export const venues = api({
  methodName: "venues",
  path: "v2/fungible/venues",
  transformResponse: (response) => response.venues,
});
