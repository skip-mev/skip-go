---
"@skip-go/widget": patch
---

Fix Keplr connection failing with "There is no modular chain info" on Keplr v0.13.53+ by removing stride-1 and kyve-1 from the default chains enabled on connect. These chains are still added on demand when selected.
