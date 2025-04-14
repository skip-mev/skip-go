import { api } from "./generateApi";

export const {
  request: postMessages,
  requestWithCancel: postMessagesWithCancel,
} = api({
  methodName: "getMsgsV2",
  method: "post",
  path: "/v2/fungible/msgs",
});
