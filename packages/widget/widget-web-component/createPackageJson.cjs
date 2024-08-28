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
        "import": "./build/index.js"
      }
    },
    "types": "./types.d.ts",
    "files": [
      "build",
      "README.md",
      "CHANGELOG.md"
    ]
  };

  const webComponentDir = path.resolve(__dirname, '../widget-web-component');
  
  // generate package.json file
  await fs.writeFile(
    path.resolve(webComponentDir, 'package.json'),
    JSON.stringify(mergedPackage, null, 2),
    { encoding: 'utf-8' }
  );

  // Copy README.md and CHANGELOG.md
  const filesToCopy = ['README.md', 'CHANGELOG.md'];
  for (const file of filesToCopy) {
    await fs.copyFile(
      path.resolve(__dirname, '..', file),
      path.resolve(webComponentDir, file)
    );
  }

}
