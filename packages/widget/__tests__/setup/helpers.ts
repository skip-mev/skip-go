import download from "download";
import path from "path";
import fs from "fs-extra";
import { Release } from "./types";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export async function prepareKeplr() {
  const release = await getKeplrReleases();

  const downloadsDirectory = path.resolve(__dirname, "../downloads");

  await createDirIfNotExist(downloadsDirectory);

  const keplrDirectory = path.join(downloadsDirectory, release.tagName);
  const keplrDirectoryExists = await checkDirOrFileExist(keplrDirectory);

  if (!keplrDirectoryExists) {
    await download(release.downloadUrl, keplrDirectory, {
      extract: true,
    });
  }

  return keplrDirectory;
}

async function getKeplrReleases() {
  const response = await fetch("https://api.github.com/repos/chainapsis/keplr-wallet/releases");

  const responseJson: Release = await response.json();

  const filename = responseJson[0].assets[0].name;
  const downloadUrl = responseJson[0].assets[0].browser_download_url;
  const tagName = responseJson[0].tag_name;

  return {
    filename,
    downloadUrl,
    tagName,
  };
}

async function createDirIfNotExist(path: string) {
  try {
    await fs.access(path);
    return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e.code === "ENOENT") {
      await fs.mkdir(path);
      return true;
    }

    throw new Error(
      `[createDirIfNotExist] Unhandled error from fs.access() with following error:\n${e}`,
    );
  }
}

async function checkDirOrFileExist(path: string) {
  try {
    await fs.access(path);
    return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e.code === "ENOENT") {
      return false;
    }

    throw new Error(
      `[checkDirOrFileExist] Unhandled error from fs.access() with following error:\n${e}`,
    );
  }
}
