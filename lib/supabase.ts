import { createClient } from "@supabase/supabase-js"
import { createLogger } from "@/utils/logging"
import type { Database } from "@/types/database.types"

const logger = createLogger("supabaseClient")

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  logger.error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  logger.error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable")
}

// Create a singleton Supabase client for browser usage
let browserClient: ReturnType<typeof createClient<Database>> | null = null

export function getSupabaseBrowser() {
  if (browserClient) return browserClient

  browserClient = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
      },
    },
  )

  return browserClient
}

// Create a Supabase client for server-side usage
export const supabaseServer = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)

// Export a default client for convenience
export default getSupabaseBrowser()

// Create a logger for Supabase operations
const loggerSupabase = createLogger("supabase")

// Export the browser client for client-side operations
export const supabase = getSupabaseBrowser()

// Export the server client for server-side operations

// Helper function to get the current authenticated user
export async function getCurrentUser() {
  try {
    const supabase = getSupabaseBrowser()
    loggerSupabase.debug("Getting current user")

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      loggerSupabase.error("Error getting current user", error)
      return null
    }

    return user
  } catch (error) {
    loggerSupabase.error("Error getting current user", error)
    return null
  }
}

// Helper function to get the current user's role
export async function getUserRole() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      loggerSupabase.debug("No authenticated user found")
      return null
    }

    const supabase = getSupabaseBrowser()
    loggerSupabase.debug("Getting user role", { userId: user.id })

    // Check if user is a patient
    const { data: patient } = await supabase.from("patients").select("id").eq("auth_id", user.id).single()

    if (patient) {
      loggerSupabase.debug("User is a patient", { patientId: patient.id })
      return { role: "patient", id: patient.id }
    }

    // Check if user is a vaccinator
    const { data: vaccinator } = await supabase.from("vaccinators").select("id, role").eq("auth_id", user.id).single()

    if (vaccinator) {
      loggerSupabase.debug("User is a vaccinator", { vaccinatorId: vaccinator.id, role: vaccinator.role })
      return { role: vaccinator.role, id: vaccinator.id }
    }

    // Default to null if no role found
    loggerSupabase.debug("No role found for user")
    return null
  } catch (error) {
    loggerSupabase.error("Error getting user role", error)
    return null
  }
}

// Helper function for error handling
export function handleSupabaseError(error: unknown): string {
  if (typeof error === "object" && error !== null && "message" in error) {
    return (error as Error).message
  }
  return "An unknown error occurred"
}
