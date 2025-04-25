---
"@skip-go/widget": patch
---

Fix useTxHistory returning completed if lastTxSuccess, instead should only return completed if isSettled and isSuccess are true
