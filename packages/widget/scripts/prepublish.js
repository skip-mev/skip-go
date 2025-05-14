/* eslint-disable */

import { writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from '../package.json' assert { type: 'json' };
import clientPkg from '@skip-go/client/package.json' assert { type: 'json' };

// Simulate __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function prepublish() {
  pkg.dependencies['@skip-go/client'] = clientPkg.version;

  const targetPath = path.resolve(__dirname, '../package.json');
  await writeFile(targetPath, JSON.stringify(pkg, null, 2), {
    encoding: 'utf-8',
  });
}

void prepublish();