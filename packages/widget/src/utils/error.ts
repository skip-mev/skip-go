export function isUserRejectedRequestError(input: unknown): input is Error {
  if (input instanceof Error) {
    if (
      // keplr | metamask
      input.message.toLowerCase().includes("rejected") ||
      // leap
      input.message.toLowerCase().includes("declined") ||
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error common user rejected request error code
      input.code === 4001
    ) {
      return true;
    }
  }
  return false;
}
