import { api } from "../utils/generateApi";

export const venues = api({
  methodName: "getVenues",
  path: "/v2/fungible/venues",
});
