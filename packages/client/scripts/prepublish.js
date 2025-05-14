import { writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from '../package.json' assert { type: 'json' };

async function prepublish() {
  const targetPath = path.resolve(process.cwd(), 'package.json');
  await writeFile(targetPath, JSON.stringify(pkg, null, 2), {
    encoding: 'utf-8',
  });
}

void prepublish();