export function transformHexToMoveDenom(denom?: string) {
  if (denom?.startsWith('0x')) {
    // Remove the 0x prefix and prepend move/
    return `move/${denom.substring(2)}`;
  }
  return denom;
}

export function isEvmNativeDenom(denom: string): boolean {
  if (!denom.startsWith('0x')) return false;
  
  // Remove 0x prefix and check if it's all zeros (allowing for different lengths)
  const hex = denom.slice(2);
  return /^0+$/.test(hex) && hex.length >= 8; // At least 8 zeros after 0x
}