import { setApiOptions } from "@skip-go/client";

// Initialize the Skip client with proper configuration
export function initializeSkipClient() {
  setApiOptions({
    apiUrl: "https://api.skip.build", // Default Skip API endpoint
    // apiKey: process.env.NEXT_PUBLIC_SKIP_API_KEY, // Uncomment if you have an API key
  });
}

// Call this function when your app initializes
initializeSkipClient();
