import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { createLogger } from "@/utils/logging"
import type { Database } from "@/types/database.types"
import type { cookies } from "next/headers"

const logger = createLogger("supabaseClient")

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  logger.error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  logger.error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable")
}

// Create a singleton pattern for the Supabase client
let browserInstance: ReturnType<typeof createSupabaseClient<Database>> | null = null

/**
 * Get a Supabase client for browser/client-side usage
 * This follows the singleton pattern to ensure only one instance exists
 */
export function getSupabaseBrowser() {
  if (browserInstance) return browserInstance

  logger.debug("Creating new browser Supabase client instance")
  browserInstance = createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        storageKey: "lavi-hospital-auth", // Use a consistent storage key
      },
    },
  )

  return browserInstance
}

// Create a singleton for server-side Supabase client
let serverInstance: ReturnType<typeof createSupabaseClient<Database>> | null = null

/**
 * Get a Supabase client for server-side usage
 * This follows the singleton pattern to ensure only one instance exists
 */
export function getSupabaseServer() {
  if (serverInstance) return serverInstance

  logger.debug("Creating new server Supabase client instance")
  serverInstance = createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )

  return serverInstance
}

// Export the browser client as default for convenience
export default getSupabaseBrowser()

// Export createClient for backward compatibility
export function createClient(cookieStore: ReturnType<typeof cookies>) {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: { path: string; maxAge: number; domain?: string }) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: { path: string; domain?: string }) {
          cookieStore.set({ name, value: "", ...options, maxAge: 0 })
        },
      },
    },
  )
}
