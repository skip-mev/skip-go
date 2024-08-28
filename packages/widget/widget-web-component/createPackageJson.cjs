const path = require('path');
const fs = require('fs/promises');

module.exports = async function createPackageJson() {
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
      "build",
      "README.md"
    ]
  };

  // Prepare web component package
  const webComponentDir = path.resolve(__dirname, '../widget-web-component');
  
  // Write web component package.json
  await fs.writeFile(
    path.resolve(webComponentDir, 'package.json'),
    JSON.stringify(mergedPackage, null, 2),
    { encoding: 'utf-8' }
  );

}
