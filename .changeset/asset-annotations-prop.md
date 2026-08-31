---
"@skip-go/widget": minor
---

Add an optional `assetAnnotations` prop (keyed by recommended symbol) that renders per-asset badges and warnings. On the swap input it shows a badge and a warning icon for the selected asset; in the token selector it shows a badge, a border highlight, a detail line, and can pin the asset to the top. Supports `info` / `warning` / `error` variants. Existing `ibcEurekaHighlightedAssets` and `assetSymbolsSortedToTop` props are unchanged.
