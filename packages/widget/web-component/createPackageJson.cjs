const path = require('path');
const fs = require('fs/promises');

module.exports = async function createPackageJson() {
  const basePackageJson = require('../package.json');

  const mergedPackage = {
    "name": "@skip-go/widget-web-component",
    "version": basePackageJson.version,
    "description": "Swap widget web component",
    "exports": {
      ".": {
        "import": "./build/index.js",
        "types": "./build/index.d.ts"
      }
    },
    "types": "./build/types.d.ts",
    "files": [
      "build",
      "README.md",
    ]
  };

  const webComponentDir = path.resolve(__dirname, '../web-component');
  
  // generate package.json file
  await fs.writeFile(
    path.resolve(webComponentDir, 'package.json'),
    JSON.stringify(mergedPackage, null, 2),
    { encoding: 'utf-8' }
  );
}
