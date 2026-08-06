---
"@skip-go/client": patch
"@skip-go/widget": patch
---

Consolidate SVM transaction version handling into boundary helpers (`serializeSvmMessage`, `simulateSvmTransaction`) so call sites no longer branch on `isVersionedTransaction`. Internal refactor with no public API or behavior change; widget is rebuilt to pick up the updated client.
