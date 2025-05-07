import { getSupabaseBrowser } from "@/lib/supabase-client"
import { createLogger } from "@/utils/logging"
import { PatientService } from "./patient-service"
import { handleSupabaseError } from "@/utils/supabase"

const logger = createLogger("authService")

// Define the auth service
export const authService = {
  /**
   * Sign in with email and password
   */
  async signInWithEmail(email: string, password: string) {
    try {
      const supabase = getSupabaseBrowser()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      logger.error("Error signing in with email", error)
      throw error
    }
  },

  /**
   * Sign up with email and password
   */
  async signUpWithEmail(email: string, password: string) {
    try {
      const supabase = getSupabaseBrowser()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      logger.error("Error signing up with email", error)
      throw error
    }
  },

  /**
   * Sign out
   */
  async signOut() {
    try {
      const supabase = getSupabaseBrowser()
      const { error } = await supabase.auth.signOut()

      if (error) {
        throw error
      }

      return true
    } catch (error) {
      logger.error("Error signing out", error)
      throw error
    }
  },

  /**
   * Get the current user
   */
  async getCurrentUser() {
    try {
      const supabase = getSupabaseBrowser()
      const { data, error } = await supabase.auth.getUser()

      if (error) {
        throw error
      }

      return data.user
    } catch (error) {
      logger.error("Error getting current user", error)
      return null
    }
  },

  /**
   * Get the current session
   */
  async getSession() {
    try {
      const supabase = getSupabaseBrowser()
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        throw error
      }

      return data.session
    } catch (error) {
      logger.error("Error getting session", error)
      return null
    }
  },

  // Reset password
  async resetPassword(email: string) {
    try {
      const supabase = getSupabaseBrowser()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
      })

      if (error) {
        console.error("Error resetting password:", error)
        throw error
      }

      return true
    } catch (error) {
      console.error("Error in resetPassword:", error)
      throw new Error(handleSupabaseError(error))
    }
  },

  // Update password
  async updatePassword(password: string) {
    try {
      const supabase = getSupabaseBrowser()
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        console.error("Error updating password:", error)
        throw error
      }

      return true
    } catch (error) {
      console.error("Error in updatePassword:", error)
      throw new Error(handleSupabaseError(error))
    }
  },

  // Get current user with profile data
  async getCurrentUserWithProfile() {
    try {
      const supabase = getSupabaseBrowser()
      const { data: authData, error: authError } = await supabase.auth.getUser()

      if (authError) {
        console.error("Error getting current user:", authError)
        throw authError
      }

      if (!authData.user) {
        return null
      }

      // Check if user is a patient
      const patient = await PatientService.getPatientByAuthId(authData.user.id)

      if (patient) {
        return {
          ...authData.user,
          profile: patient,
          role: "patient",
        }
      }

      // If not a patient, check if user is a vaccinator
      const { data: vaccinator, error: vaccinatorError } = await supabase
        .from("vaccinators")
        .select("*")
        .eq("auth_id", authData.user.id)
        .single()

      if (vaccinatorError && vaccinatorError.code !== "PGRST116") {
        console.error("Error getting vaccinator profile:", vaccinatorError)
        throw vaccinatorError
      }

      if (vaccinator) {
        return {
          ...authData.user,
          profile: vaccinator,
          role: vaccinator.role,
        }
      }

      // User exists but has no profile
      return {
        ...authData.user,
        profile: null,
        role: null,
      }
    } catch (error) {
      console.error("Error in getCurrentUserWithProfile:", error)
      throw new Error(handleSupabaseError(error))
    }
  },
}
