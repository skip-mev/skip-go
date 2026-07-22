---
"@skip-go/client": patch
"@skip-go/widget": patch
---

Handle `cctp_transfer_v2` entries in transaction status responses. They previously fell through the transfer type checks, leaving the event without a type, chain ids or explorer links, and reporting a `failed` status while the transfer was still pending.
