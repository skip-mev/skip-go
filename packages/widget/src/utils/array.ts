export function isSubset<T>(arrayA: T[], arrayB: T[]): boolean {
  const setA = new Set(arrayA);
  return arrayB.every((item) => setA.has(item));
}
