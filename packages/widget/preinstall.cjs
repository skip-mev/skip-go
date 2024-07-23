const fs = require('fs');
const path = require('path');

const npmrcPath = path.resolve(__dirname, '../../../.npmrc');
const registryConfig = '@buf:registry=https://buf.build/gen/npm/v1/';

if (!fs.existsSync(npmrcPath)) {
  fs.writeFileSync(npmrcPath, registryConfig);
} else {
  const npmrcContent = fs.readFileSync(npmrcPath, 'utf-8');
  if (!npmrcContent.includes(registryConfig)) {
    fs.appendFileSync(npmrcPath, `\n${registryConfig}`);
  }
}

console.log('.npmrc configured for @buf registry');
