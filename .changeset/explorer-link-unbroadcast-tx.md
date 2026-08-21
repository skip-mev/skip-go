---
"@skip-go/widget": patch
---

Fix broken explorer link when txs aren't broadcast yet: skip `transactionDetails` entries without a `txHash` (was leaking a trailing comma / empty URL), and hide the "View on explorer" / "Route explorer" link when no tx has broadcast.
