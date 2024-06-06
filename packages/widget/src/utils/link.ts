export const makeExplorerLink = (link: string) => {
  return {
    link,
    shorthand: `${link.split("/").at(-1)?.slice(0, 6)}…${link.split("/").at(-1)?.slice(-6)}`,
  };
};
