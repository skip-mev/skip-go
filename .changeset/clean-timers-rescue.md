---
"@skip-go/client": major
---

Refactored client library to export seperate functions instead of single class to improve treeshaking and reduce bundle size impact
Refactored prop/variable naming to follow camelCase and PascalCase (for enums) strictly to autogenerate interfaces based on open api spec (swagger.yml) and use util functions to easily convert between camelCase and snake_case for API consumption
Added auto-cancelling previous requests if multiple requests for the same API are made before previous one completes