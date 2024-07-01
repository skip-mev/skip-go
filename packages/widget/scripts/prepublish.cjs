/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs/promises');
const path = require('path');
const packageJson = require('../package.json');
const coreVersion = require('@skip-go/core/package.json').version;

async function prepublish() {
  delete packageJson.scripts;
  delete packageJson.devDependencies;
  packageJson.dependencies['@skip-go/core'] = coreVersion;
  const targetPath = path.resolve(process.cwd(), 'package.json');
  await fs.writeFile(targetPath, JSON.stringify(packageJson, null, 2), {
    encoding: 'utf-8',
  });
}

void prepublish();
