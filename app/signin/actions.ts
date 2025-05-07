"use server"

import { z } from "zod"
import { cookies } from "next/headers"
import { createLogger } from "@/utils/logging"
import { getSupabaseServer } from "@/lib/supabase-client"
import { AuthService } from "@/services/auth-service"

const logger = createLogger("signinActions")

// Define the signin form schema with Zod
export const signinFormSchema = z.object({
  email: z.string().email("Please enter a valid email address").toLowerCase(),
  password: z.string().min(1, "Password is required"),
})

export type SigninFormValues = z.infer<typeof signinFormSchema>

export async function signIn(formData: SigninFormValues) {
  try {
    logger.info("Signing in user", { email: formData.email })

    // Validate the form data
    const validatedData = signinFormSchema.parse(formData)

    // Sign in with Supabase
    const supabase = getSupabaseServer()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    })

    if (error) {
      logger.error("Error signing in", error)
      return {
        success: false,
        message: error.message,
      }
    }

    if (!data?.user) {
      logger.error("No user returned from sign in")
      return {
        success: false,
        message: "Failed to sign in",
      }
    }

    // Check if the user is a patient
    const { data: patient } = await supabase.from("patients").select("id").eq("auth_id", data.user.id).single()

    if (patient) {
      logger.info("User is a patient, redirecting to patient dashboard")
      return {
        success: true,
        redirectTo: "/patient/dashboard",
      }
    }

    // Check if the user is a vaccinator
    const { data: vaccinator } = await supabase
      .from("vaccinators")
      .select("id, role")
      .eq("auth_id", data.user.id)
      .single()

    if (vaccinator) {
      logger.info("User is a vaccinator, redirecting based on role")

      if (vaccinator.role === "admin") {
        return {
          success: true,
          redirectTo: "/admin/dashboard",
        }
      } else {
        return {
          success: true,
          redirectTo: "/doctor/dashboard",
        }
      }
    }

    // If we get here, the user doesn't have a role
    logger.error("User doesn't have a role")
    return {
      success: false,
      message: "Your account doesn't have a role assigned. Please contact support.",
    }
  } catch (error) {
    logger.error("Error signing in", error)

    let errorMessage = "Failed to sign in"

    if (error instanceof Error) {
      errorMessage = error.message
    }

    return {
      success: false,
      message: errorMessage,
    }
  }
}

export async function signOut() {
  try {
    await AuthService.signOut()
    cookies().delete("session")
    return { success: true }
  } catch (error) {
    console.error("Error in signOut:", error)
    return { success: false, error: "An error occurred during sign out" }
  }
}
