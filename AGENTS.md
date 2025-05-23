# Repository Instructions

All Codex PRs must include a changeset entry.

1. Run `npx changeset` from the repository root.
2. Commit the generated file in `.changeset/` with the rest of your changes.

## Rules for create testinh in the packages/widget directory

1. The test file should be name same as the file being tested, with a `.test.ts` suffix.
2. Testing functions should be imported from `@playwright/test`
3. Write multiple test cases
