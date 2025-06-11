/* eslint-disable */

import fs from "fs-extra";
import path from "path";
import { PNG } from "pngjs";

// Directories
const EXPECTED_DIR = path.join(process.cwd(), "__tests__/Widget/expected");
const NEW_DIR = path.join(process.cwd(), "__tests__/Widget/new");
const DIFF_DIR = path.join(process.cwd(), "__tests__/Widget/diff");
const COMBINED_DIR = path.join(process.cwd(), '__tests__/Widget/combined');

// Threshold to ignore tiny changes (0–255)
const PIXEL_DIFF_THRESHOLD = 150;

function pixelDifference(a, b) {
  const dr = Math.abs(a[0] - b[0]);
  const dg = Math.abs(a[1] - b[1]);
  const db = Math.abs(a[2] - b[2]);
  return dr + dg + db;
}

function generateColoredDiff(expected, actual) {
  const { width, height } = expected;
  const diff = new PNG({ width, height });

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      const exp = expected.data.slice(idx, idx + 3); // [R, G, B]
      const act = actual.data.slice(idx, idx + 3);
      const alpha = expected.data[idx + 3]; // use expected alpha

      if (pixelDifference(exp, act) > PIXEL_DIFF_THRESHOLD) {
        // highlight changed pixel in red
        diff.data[idx] = 255; // R
        diff.data[idx + 1] = 0; // G
        diff.data[idx + 2] = 0; // B
        diff.data[idx + 3] = 255; // full alpha
      } else {
        // copy original expected color
        diff.data[idx] = expected.data[idx];
        diff.data[idx + 1] = expected.data[idx + 1];
        diff.data[idx + 2] = expected.data[idx + 2];
        diff.data[idx + 3] = alpha;
      }
    }
  }

  return diff;
}

function stitchTriplet(expected, diff, actual) {
  const SPACING = 10; // space in pixels between images
  const width =
    expected.width + diff.width + actual.width + SPACING * 2;
  const height = expected.height;

  const combined = new PNG({ width, height });

  const copy = (src, xOffset) => {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < src.width; x++) {
        const srcIdx = (y * src.width + x) * 4;
        const dstIdx = (y * width + (x + xOffset)) * 4;
        for (let i = 0; i < 4; i++) {
          combined.data[dstIdx + i] = src.data[srcIdx + i];
        }
      }
    }
  };

  const expectedOffset = 0;
  const diffOffset = expected.width + SPACING;
  const actualOffset = expected.width + diff.width + SPACING * 2;

  copy(expected, expectedOffset);
  copy(diff, diffOffset);
  copy(actual, actualOffset);

  return combined;
}

async function processImage(fileName) {
  const expectedPath = path.join(EXPECTED_DIR, fileName);
  const newPath = path.join(NEW_DIR, fileName);
  const diffPath = path.join(DIFF_DIR, fileName);
  const combinedPath = path.join(COMBINED_DIR, fileName);

  if (!(await fs.pathExists(expectedPath)) || !(await fs.pathExists(newPath))) {
    console.warn(`⚠️  Skipping ${fileName}: expected or new image missing`);
    return;
  }

  const expected = PNG.sync.read(await fs.readFile(expectedPath));
  const actual = PNG.sync.read(await fs.readFile(newPath));

  if (expected.width !== actual.width || expected.height !== actual.height) {
    console.warn(`⚠️  Skipping ${fileName}: images must be same dimensions`);
    return;
  }

  const diff = generateColoredDiff(expected, actual);
  await fs.ensureDir(DIFF_DIR);
  await fs.writeFile(diffPath, PNG.sync.write(diff));

  const combined = stitchTriplet(expected, diff, actual);
  await fs.ensureDir(COMBINED_DIR);
  await fs.writeFile(combinedPath, PNG.sync.write(combined));

  console.log(`✅ Processed: ${fileName}`);
}

async function run() {
  const files = await fs.readdir(NEW_DIR);
  const pngFiles = files.filter((f) => f.endsWith(".png"));

  for (const file of pngFiles) {
    await processImage(file);
  }
}

run().catch((err) => {
  console.error("❌ Error:", err);
});
