---
"@skip-go/client": minor
"@skip-go/widget": minor
---

Fix Cosmos transactions failing with "Number can only safely store up to 53 bits" for new accounts on Cosmos SDK v0.54+ chains (e.g. Xion, Stride, Chihuahua), which are assigned account numbers above 2^53.

Upgrades CosmJS to 0.39.0, which requires Node.js 22 or newer.
