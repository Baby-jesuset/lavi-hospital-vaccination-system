/**
 * Supabase client utility
 */

import { createLogger } from "@/utils/logging"
import { getSupabaseBrowser } from "@/lib/supabase-client"

const logger = createLogger("supabaseUtils")

/**
 * Helper function to get the current authenticated user
 */
export async function getCurrentUser() {
  try {
    const supabase = getSupabaseBrowser()
    logger.debug("Getting current user")

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      logger.error("Error getting current user:", error)
      return null
    }

    return user
  } catch (error) {
    logger.error("Error getting current user:", error)
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

    const supabase = getSupabaseBrowser()
    // Get the user's profile based on their role
    const { data: profile, error } = await supabase.from("profiles").select("*").eq("user_id", user.id).single()

    if (error) {
      logger.error("Error getting user profile:", error)
      return null
    }

    return profile
  } catch (error) {
    logger.error("Error getting user profile:", error)
    return null
  }
}

/**
 * Helper function to sign out the current user
 */
export async function signOut() {
  try {
    const supabase = getSupabaseBrowser()
    const { error } = await supabase.auth.signOut()

    if (error) {
      logger.error("Error signing out:", error)
      return false
    }

    return true
  } catch (error) {
    logger.error("Error signing out:", error)
    return false
  }
}
