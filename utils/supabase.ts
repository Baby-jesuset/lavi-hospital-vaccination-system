/**
 * Supabase client utility
 */

import { createClient } from "@supabase/supabase-js"
import type { Database } from "../types/supabase"

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Create a single instance of the Supabase client to be used throughout the app
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

/**
 * Helper function to get the current authenticated user
 */
export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      throw error
    }

    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

/**
 * Helper function to get the current user's profile data
 */
export async function getCurrentUserProfile() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return null
    }

    // Get the user's profile based on their role
    const { data: profile, error } = await supabase.from("profiles").select("*").eq("user_id", user.id).single()

    if (error) {
      throw error
    }

    return profile
  } catch (error) {
    console.error("Error getting user profile:", error)
    return null
  }
}

/**
 * Helper function to sign out the current user
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw error
    }

    return true
  } catch (error) {
    console.error("Error signing out:", error)
    return false
  }
}
