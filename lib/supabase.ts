import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database.types"

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a single instance of the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper function to get the current authenticated user
export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.error("Error getting current user:", error)
      return null
    }

    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Helper function to get the current user's role - updated for new schema
export async function getUserRole() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return null
    }

    // Check if user is a patient - using patient_id
    const { data: patient } = await supabase.from("patients").select("patient_id").eq("auth_id", user.id).single()

    if (patient) {
      return { role: "patient", id: patient.patient_id }
    }

    // Check if user is a vaccinator - using vaccinator_id
    const { data: vaccinator } = await supabase
      .from("vaccinators")
      .select("vaccinator_id")
      .eq("auth_id", user.id)
      .single()

    if (vaccinator) {
      return { role: "doctor", id: vaccinator.vaccinator_id }
    }

    // Default to null if no role found
    return null
  } catch (error) {
    console.error("Error getting user role:", error)
    return null
  }
}

// Function to create a server client
export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
        Accept: "application/json",
      },
    },
  })
}
