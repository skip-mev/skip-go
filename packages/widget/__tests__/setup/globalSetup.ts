/* eslint-disable no-console */
import dotenv from "dotenv";

/**
 * Global setup for Playwright tests
 * Loads environment variables and validates configuration
 */
export default async function globalSetup() {
  console.log("🔧 Running global setup for e2e tests...");

  // Load environment variables
  dotenv.config({
    path: ".env",
    override: true,
  });

  // Validate environment (optional variables)
  validateEnvironment();

  console.log("✅ Global setup complete");
}

/**
 * Validates that required environment variables are set
 * Logs warnings for missing optional variables
 */
function validateEnvironment() {
  const optionalVars = {
    WORD_PHRASE_KEY: "Wallet mnemonic phrase (will use default test phrase if not set)",
    UPDATE_SCREENSHOTS: "Set to 'true' to update expected screenshots",
    SLOW_MODE: "Set to a number to slow down actions (for debugging)",
  };

  // Log optional variables
  console.log("📋 Environment configuration:");
  for (const [key, description] of Object.entries(optionalVars)) {
    const value = process.env[key];
    if (value) {
      // Mask sensitive values
      const displayValue = key === "WORD_PHRASE_KEY" ? "***" : value;
      console.log(`   ✓ ${key}: ${displayValue}`);
    } else {
      console.log(`   ○ ${key}: (not set) - ${description}`);
    }
  }

  // Validate CI environment
  if (process.env.CI) {
    console.log("🤖 Running in CI environment");
  } else {
    console.log("💻 Running in local environment");
  }
}
