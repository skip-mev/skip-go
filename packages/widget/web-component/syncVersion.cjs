const path = require('path');
const fs = require('fs/promises');

module.exports = async function syncVersion() {
  const basePackageJson = require('../package.json');
  const webComponentPackageJson = require('./package.json');

  webComponentPackageJson.version = basePackageJson.version;

  const targetFile = path.resolve(path.resolve(__dirname, '../web-component'), 'package.json');
  
  await fs.writeFile(targetFile, JSON.stringify(webComponentPackageJson, null, 2), {
    encoding: 'utf-8'
  });
}
