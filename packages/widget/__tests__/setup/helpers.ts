/* eslint-disable no-console */
import download from "download";
import path from "path";
import fs from "fs-extra";
import { Release } from "./types";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Prepares Keplr extension for testing
 * Downloads the latest release if not already cached
 * @returns Path to the Keplr extension directory
 * @throws Error if download or extraction fails
 */
export async function prepareKeplr(): Promise<string> {
  try {
    // Get latest release info
    const release = await getKeplrReleases();
    console.log(`   Found Keplr version: ${release.tagName}`);

    const downloadsDirectory = path.resolve(__dirname, "../downloads");
    await createDirIfNotExist(downloadsDirectory);

    const keplrDirectory = path.join(downloadsDirectory, release.tagName);
    const keplrDirectoryExists = await checkDirOrFileExist(keplrDirectory);

    if (!keplrDirectoryExists) {
      console.log(`   Downloading Keplr from: ${release.downloadUrl}`);
      await download(release.downloadUrl, keplrDirectory, {
        extract: true,
      });
      console.log("   ✅ Download complete");
    } else {
      console.log("   ✅ Using cached Keplr extension");
    }

    return keplrDirectory;
  } catch (error) {
    console.error("❌ Failed to prepare Keplr extension");
    console.error(`   Error: ${error instanceof Error ? error.message : error}`);
    throw new Error(`Keplr preparation failed: ${error}`);
  }
}

/**
 * Fetches the latest Keplr release information from GitHub
 * @returns Release information including download URL and version
 * @throws Error if GitHub API request fails
 */
async function getKeplrReleases() {
  try {
    const response = await fetch("https://api.github.com/repos/chainapsis/keplr-wallet/releases");

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}: ${response.statusText}`);
    }

    const responseJson: Release[] = await response.json();

    if (!responseJson || responseJson.length === 0) {
      throw new Error("No releases found");
    }

    const latestRelease = responseJson[0];

    if (!latestRelease.assets || latestRelease.assets.length === 0) {
      throw new Error("No assets found in latest release");
    }

    const filename = latestRelease.assets[0].name;
    const downloadUrl = latestRelease.assets[0].browser_download_url;
    const tagName = latestRelease.tag_name;

    return {
      filename,
      downloadUrl,
      tagName,
    };
  } catch (error) {
    console.error("❌ Failed to fetch Keplr releases from GitHub");
    console.error(`   Error: ${error instanceof Error ? error.message : error}`);
    throw error;
  }
}

/**
 * Creates a directory if it doesn't exist
 * @param path - Directory path to create
 * @returns true if directory was created or already exists
 * @throws Error if directory creation fails
 */
async function createDirIfNotExist(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e.code === "ENOENT") {
      try {
        await fs.mkdir(path, { recursive: true });
        return true;
      } catch (mkdirError) {
        throw new Error(
          `Failed to create directory ${path}: ${mkdirError instanceof Error ? mkdirError.message : mkdirError}`,
        );
      }
    }

    throw new Error(
      `Unexpected error checking directory ${path}: ${e instanceof Error ? e.message : e}`,
    );
  }
}

/**
 * Checks if a directory or file exists
 * @param path - Path to check
 * @returns true if exists, false otherwise
 * @throws Error if check fails for reasons other than non-existence
 */
async function checkDirOrFileExist(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e.code === "ENOENT") {
      return false;
    }

    throw new Error(
      `Unexpected error checking path ${path}: ${e instanceof Error ? e.message : e}`,
    );
  }
}
