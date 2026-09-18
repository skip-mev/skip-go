---
"@skip-go/client": patch
"@skip-go/widget": patch
---

Restore the previous incomplete route status calculation and update the Action Required message to cover pending signature requests as well as reverted transactions.

Increase the wait for asset release information from 15 seconds to two minutes before showing the failure UI. Existing immediate handling when release information or an execution error is available remains unchanged.
