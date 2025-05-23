---
"@skip-go/client": patch
---
Fix logic that detected absence of Cosmos and SVM transactions in `validateGasBalances`.
Previously the check always failed, causing gas balance validation to run even when only
EVM transactions were present. This patch ensures the function exits early when there are
no Cosmos or SVM transactions to validate.
