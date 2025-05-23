# Repository Instructions

## All Codex PRs must include a changeset entry.

1. From the repository root run `npx changeset`.
2. Commit the generated file inside `.changeset/` with the rest of your changes.

## Testing rules for `packages/widget`

1. Name each test file after the file being tested and append the `.test.ts` suffix.
2. Import testing utilities from `@playwright/test`.
3. Include multiple test cases in every file.

## Best Practices

1. Keep PRs focused on a single change.
2. Write descriptive commit messages in the imperative mood, e.g. "Add widget tests".
3. Favor small helper functions over repeated logic.
4. Document complex code with comments.
