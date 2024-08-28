/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs/promises');
const path = require('path');
const packageJson = require('../package.json');
const coreVersion = require('@skip-go/client/package.json').version;
const webComponentPackageJson = require('./create-web-component-package-json.cjs');


async function prepublish() {
  delete packageJson.scripts;
  delete packageJson.devDependencies;
  packageJson.dependencies['@skip-go/client'] = coreVersion;
  const targetPath = path.resolve(process.cwd(), 'package.json');
  await fs.writeFile(targetPath, JSON.stringify(packageJson, null, 2), {
    encoding: 'utf-8',
  });

 // Prepare web component package
 const webComponentDir = path.resolve(__dirname, '../widget-web-component');
 await fs.mkdir(webComponentDir, { recursive: true });
 
 // Write web component package.json
 await fs.writeFile(
   path.resolve(webComponentDir, 'package.json'),
   JSON.stringify(webComponentPackageJson(), null, 2),
   { encoding: 'utf-8' }
 );
}

void prepublish();
