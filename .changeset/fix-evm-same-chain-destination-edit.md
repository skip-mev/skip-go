---
"@skip-go/widget": patch
---

Hide edit destination button for EVM same-chain swaps. EVM DEX contracts return tokens to msg.sender, so editing the destination address has no effect on same-chain swaps.
