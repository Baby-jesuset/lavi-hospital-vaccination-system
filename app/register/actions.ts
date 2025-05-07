"use server"

import { z } from "zod"
import { createLogger } from "@/utils/logging"
import { getSupabaseServer } from "@/lib/supabase-client"
import { v4 as uuidv4 } from "uuid"

const logger = createLogger("registerActions")

// Define the registration form schema with Zod
export const registerFormSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email address").toLowerCase(),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .regex(/^\+?[0-9\s\-()]+$/, "Invalid phone number format"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    gender: z.enum(["male", "female", "other", "prefer_not_to_say"]),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
    emergencyContactName: z.string().min(1, "Emergency contact name is required"),
    emergencyContactPhone: z
      .string()
      .min(10, "Emergency contact phone must be at least 10 digits")
      .regex(/^\+?[0-9\s\-()]+$/, "Invalid phone number format"),
    emergencyContactRelationship: z.string().min(1, "Emergency contact relationship is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export type RegisterFormValues = z.infer<typeof registerFormSchema>

export async function registerPatient(formData: RegisterFormValues) {
  try {
    logger.info("Registering new patient", { email: formData.email })

    // Validate the form data
    const validatedData = registerFormSchema.parse(formData)

    // Create a Supabase auth user
    const supabase = getSupabaseServer()

    // Check if user with this email already exists
    const { data: existingUsers, error: checkError } = await supabase
      .from("patients")
      .select("id")
      .eq("email", validatedData.email)
      .limit(1)

    if (checkError) {
      logger.error("Error checking for existing user", checkError)
      return {
        success: false,
        message: "Error checking for existing user: " + checkError.message,
      }
    }

    if (existingUsers && existingUsers.length > 0) {
      return {
        success: false,
        message: "A user with this email already exists",
      }
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: validatedData.email,
      password: validatedData.password,
      email_confirm: false,
    })

    if (authError) {
      logger.error("Error creating auth user", authError)
      return {
        success: false,
        message: "Error creating user account: " + authError.message,
      }
    }

    if (!authData?.user) {
      logger.error("No user returned from auth creation")
      return {
        success: false,
        message: "Failed to create user account: No user data returned",
      }
    }

    // Create the patient record
    const patientId = uuidv4()
    const patientData = {
      id: patientId,
      auth_id: authData.user.id,
      first_name: validatedData.firstName,
      last_name: validatedData.lastName,
      email: validatedData.email,
      phone: validatedData.phone,
      date_of_birth: validatedData.dateOfBirth,
      gender: validatedData.gender,
      address: validatedData.address,
      city: validatedData.city,
      state: validatedData.state,
      postal_code: validatedData.postalCode,
      country: validatedData.country,
      emergency_contact_name: validatedData.emergencyContactName,
      emergency_contact_phone: validatedData.emergencyContactPhone,
      emergency_contact_relationship: validatedData.emergencyContactRelationship,
      status: "active",
    }

    const { data: patient, error: patientError } = await supabase
      .from("patients")
      .insert([patientData])
      .select()
      .single()

    if (patientError) {
      logger.error("Error creating patient", patientError)

      // Try to clean up the auth user if patient creation fails
      try {
        await supabase.auth.admin.deleteUser(authData.user.id)
      } catch (cleanupError) {
        logger.error("Failed to clean up auth user after patient creation error", cleanupError)
      }

      return {
        success: false,
        message: "Error creating patient record: " + patientError.message,
      }
    }

    // Send email verification
    const { error: verificationError } = await supabase.auth.admin.generateLink({
      type: "signup",
      email: validatedData.email,
    })

    if (verificationError) {
      logger.error("Error sending verification email", verificationError)
      // We don't want to fail the registration if the verification email fails
      // Just log the error and continue
    }

    logger.info("Patient registered successfully", { id: patient.id })

    return {
      success: true,
      data: patient,
      message: "Registration successful! Please check your email to verify your account.",
    }
  } catch (error) {
    logger.error("Error registering patient", error)

    let errorMessage = "Failed to register patient"

    if (error instanceof Error) {
      errorMessage = error.message

      // Handle specific error cases
      if (error.message.includes("duplicate")) {
        errorMessage = "A user with this email already exists"
      }
    }

    return {
      success: false,
      message: errorMessage,
    }
  }
}

export async function verifyEmail(token: string) {
  try {
    const supabase = getSupabaseServer()
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: "email",
    })

    if (error) {
      console.error("Error verifying email:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in verifyEmail:", error)
    return { success: false, error: "An error occurred during email verification" }
  }
}
