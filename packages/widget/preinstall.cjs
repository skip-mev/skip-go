const fs = require('fs');
const path = require('path');

const yarnLockPath = path.resolve(__dirname, '../../../yarn.lock');
const packageLockPath = path.resolve(__dirname, '../../../package-lock.json');
const yarnrcPath = path.resolve(__dirname, '../../../.yarnrc.yml');
const npmrcPath = path.resolve(__dirname, '../../../.npmrc');

const yarnRegistryConfig = `
npmScopes:
  buf:
    npmRegistryServer: 'https://buf.build/gen/npm/v1'
`;

const npmRegistryConfig = '@buf:registry=https://buf.build/gen/npm/v1/';

function configureYarnrc() {
  console.log(`Checking for .yarnrc.yml at ${yarnrcPath}`);
  if (!fs.existsSync(yarnrcPath)) {
    console.log('.yarnrc.yml not found, creating it.');
    fs.writeFileSync(yarnrcPath, yarnRegistryConfig.trim());
  } else {
    const yarnrcContent = fs.readFileSync(yarnrcPath, 'utf-8');
    if (!yarnrcContent.includes(yarnRegistryConfig.trim())) {
      console.log('Appending registry config to .yarnrc.yml');
      fs.appendFileSync(yarnrcPath, `\n${yarnRegistryConfig.trim()}`);
    } else {
      console.log('Registry config already present in .yarnrc.yml');
    }
  }
  console.log('.yarnrc.yml configured for @buf registry');
}

function configureNpmrc() {
  console.log(`Checking for .npmrc at ${npmrcPath}`);
  if (!fs.existsSync(npmrcPath)) {
    console.log('.npmrc not found, creating it.');
    fs.writeFileSync(npmrcPath, npmRegistryConfig);
  } else {
    const npmrcContent = fs.readFileSync(npmrcPath, 'utf-8');
    if (!npmrcContent.includes(npmRegistryConfig)) {
      console.log('Appending registry config to .npmrc');
      fs.appendFileSync(npmrcPath, `\n${npmRegistryConfig}`);
    } else {
      console.log('Registry config already present in .npmrc');
    }
  }
  console.log('.npmrc configured for @buf registry');
}

function main() {
  if (fs.existsSync(yarnLockPath)) {
    console.log('Detected yarn.lock, configuring Yarn registry.');
    configureYarnrc();
  } else if (fs.existsSync(packageLockPath)) {
    console.log('Detected package-lock.json, configuring npm registry.');
    configureNpmrc();
  } else {
    console.log(
      'No lock file detected. Please use either Yarn or npm to manage dependencies.'
    );
  }
}

console.log('Running configuration script');

main();

console.log('Configuration complete.');
