import { api } from "./generateApi";

export const {
  request: postMessages,
  requestWithCancel: postMessagesWithCancel,
} = api("getMsgsV2", "/v2/fungible/msgs");
