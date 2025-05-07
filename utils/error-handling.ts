/**
 * Utility functions for handling Supabase and other errors
 */

import type { PostgrestError } from "@supabase/supabase-js"
import type { FieldPath, UseFormSetError } from "react-hook-form"
import { logError } from "@/utils/logging"

/**
 * Maps common Supabase error codes to user-friendly messages
 */
export function getErrorMessage(error: unknown): string {
  if (!error) return "An unknown error occurred"

  // Handle PostgrestError from Supabase
  if (isPostgrestError(error)) {
    const pgError = error as PostgrestError

    // Handle specific PostgreSQL error codes
    switch (pgError.code) {
      case "23505": // unique_violation
        return "This record already exists."
      case "23503": // foreign_key_violation
        return "Referenced record does not exist."
      case "23502": // not_null_violation
        return "Required field is missing."
      case "42P01": // undefined_table
        return "System error: Table not found."
      case "42703": // undefined_column
        return "System error: Column not found."
      default:
        return pgError.message || "Database error occurred."
    }
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message
  }

  // Handle string errors
  if (typeof error === "string") {
    return error
  }

  // Default fallback
  return "An unexpected error occurred"
}

/**
 * Type guard for PostgrestError
 */
function isPostgrestError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && "message" in error && "details" in error
}

/**
 * Sets form errors based on Supabase error responses
 */
export function handleFormErrors<T extends Record<string, any>>(error: unknown, setError: UseFormSetError<T>): void {
  if (!error) return

  if (isPostgrestError(error)) {
    const pgError = error as PostgrestError

    // Handle unique constraint violations
    if (pgError.code === "23505") {
      const detail = pgError.details

      // Extract field name from error detail
      // Example: "Key (email)=(test@example.com) already exists."
      const match = detail.match(/Key $$([^)]+)$$/)
      if (match && match[1]) {
        const field = match[1] as FieldPath<T>
        setError(field, {
          type: "server",
          message: "This value already exists and must be unique.",
        })
        return
      }
    }

    // Handle foreign key violations
    if (pgError.code === "23503") {
      const detail = pgError.details

      // Extract field name from error detail
      // Example: "Key (department_id)=(123) is not present in table "departments"."
      const match = detail.match(/Key $$([^)]+)$$/)
      if (match && match[1]) {
        const field = match[1] as FieldPath<T>
        setError(field, {
          type: "server",
          message: "Selected value is invalid or no longer exists.",
        })
        return
      }
    }
  }

  // Set a generic form error if we couldn't map to a specific field
  setError("root.serverError" as FieldPath<T>, {
    type: "server",
    message: getErrorMessage(error),
  })
}

/**
 * Logs errors in a consistent format
 */
export function logErrorAndReturn(context: string, error: unknown): string {
  logError(context, "An error occurred", error)
  return getErrorMessage(error)
}
