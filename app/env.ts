// Environment variables with defaults
export const ENV = {
  DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_MODE === "true" || false,
  LOG_LEVEL: (process.env.NEXT_PUBLIC_LOG_LEVEL || "info") as "debug" | "info" | "warn" | "error",
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
}
