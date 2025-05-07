import { ENV } from "@/app/env"

/**
 * Utility functions for logging in the application
 */

// Log levels
export type LogLevel = "debug" | "info" | "warn" | "error"

// Configuration for logging
const config = {
  // Enable/disable logging for different environments
  enabled: process.env.NODE_ENV !== "production" || ENV.DEBUG_MODE,

  // Minimum log level to display
  minLevel: ENV.LOG_LEVEL,

  // Whether to include timestamps
  timestamps: true,
}

// Log level priorities (higher number = more severe)
const logLevelPriority: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

/**
 * Determine if a log level should be displayed based on the minimum level
 */
function shouldLog(level: LogLevel): boolean {
  if (!config.enabled) return false
  return logLevelPriority[level] >= logLevelPriority[config.minLevel]
}

/**
 * Format a log message with context and timestamp
 */
function formatLogMessage(level: LogLevel, context: string, message: string): string {
  const timestamp = config.timestamps ? `[${new Date().toISOString()}]` : ""
  return `${timestamp} [${level.toUpperCase()}] [${context}] ${message}`
}

/**
 * Log a debug message
 */
export function logDebug(context: string, message: string, data?: any): void {
  if (!shouldLog("debug")) return

  console.debug(formatLogMessage("debug", context, message))
  if (data !== undefined) {
    console.debug(data)
  }
}

/**
 * Log an info message
 */
export function logInfo(context: string, message: string, data?: any): void {
  if (!shouldLog("info")) return

  console.info(formatLogMessage("info", context, message))
  if (data !== undefined) {
    console.info(data)
  }
}

/**
 * Log a warning message
 */
export function logWarn(context: string, message: string, data?: any): void {
  if (!shouldLog("warn")) return

  console.warn(formatLogMessage("warn", context, message))
  if (data !== undefined) {
    console.warn(data)
  }
}

/**
 * Log an error message
 */
export function logError(context: string, message: string, error?: any): void {
  if (!shouldLog("error")) return

  console.error(formatLogMessage("error", context, message))
  if (error !== undefined) {
    console.error(error)
  }

  // In a production app, you might want to send this to a logging service
  // Example: Sentry.captureException(error);
}

/**
 * Create a logger instance for a specific context
 */
export function createLogger(context: string) {
  return {
    debug: (message: string, data?: any) => logDebug(context, message, data),
    info: (message: string, data?: any) => logInfo(context, message, data),
    warn: (message: string, data?: any) => logWarn(context, message, data),
    error: (message: string, error?: any) => logError(context, message, error),
  }
}
