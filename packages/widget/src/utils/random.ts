export function randomId(length = 8) {
  return Math.random()
    .toString(16)
    .substring(2, length + 2);
}
