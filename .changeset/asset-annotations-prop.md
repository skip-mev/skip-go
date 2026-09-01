---
"@skip-go/widget": minor
---

Add an optional `assetAnnotations` prop (keyed by recommended symbol) that renders per-asset annotations. On the swap input it shows a badge and a warning icon for the selected asset; in the token selector it shows a border highlight and a detail line, and can pin the asset to the top. Supports `info` / `warning` / `error` variants.

BREAKING: the `ibcEurekaHighlightedAssets` prop is removed. Use `assetAnnotations` for per-asset highlighting instead.
