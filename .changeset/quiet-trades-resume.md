---
"@skip-go/client": patch
"@skip-go/widget": patch
---

Increase the fixed Cosmos gas limit from 300,000 to 350,000 and remove the Evmos exception. Keep multi-transaction routes in progress while awaiting follow-up signing, and fix indefinite loading after continuing a reverted transaction by synchronizing the displayed source amount with the route query amount.
