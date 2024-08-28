module.exports = function createPackageJson() {
  const basePackageJson = require('../package.json');

  const mergedPackage = {
    ...basePackageJson,
    "name": "@skip-go/widget-web-component",
    "description": "Swap widget web component",
    "exports": {
      ".": {
        "import": "./build/index.js"
      }
    },
    "scripts": {
      "publish": "npm publish widget-web-component --access public"
    },
    "files": [
      "web-component-build",
      "README.md"
    ]
  };

  return mergedPackage;
}