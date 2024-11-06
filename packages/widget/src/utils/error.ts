export function isUserRejectedRequestError(input: unknown): input is Error {
  if (input instanceof Error) {
    if (
      // keplr | metamask
      input.message.toLowerCase().includes("rejected") ||
      // leap
      input.message.toLowerCase().includes("declined") ||

      input.message.toLowerCase().includes("denied") ||

      // @ts-expect-error common user rejected request error code
      input.code === 4001
    ) {
      return true;
    }
  }
  return false;
}
