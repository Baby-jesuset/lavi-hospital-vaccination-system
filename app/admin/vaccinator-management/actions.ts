"use server"

import { vaccinatorService } from "@/services/vaccinator-service"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createLogger } from "@/utils/logging"
import { v4 as uuidv4 } from "uuid"
import { getSupabaseServer } from "@/lib/supabase-client"

// Create a logger for these actions
const logger = createLogger("vaccinatorActions")

// Define the vaccinator form schema with Zod
export const vaccinatorFormSchema = z
  .object({
    // Basic information
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email address").toLowerCase(),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .regex(/^\+?[0-9\s\-()]+$/, "Invalid phone number format"),

    // Professional details
    departmentId: z.string().min(1, "Please select a valid department"), // Foreign key to departments table
    specialization: z.string().optional(),
    credentials: z.string().optional(),
    licenseNumber: z.string().min(1, "License number is required"),

    // System fields
    status: z.enum(["active", "inactive", "on_leave"]).default("active"),

    // Authentication (handled separately in auth tables)
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),

    // Flattened availability fields
    availableMonday: z.boolean().default(true),
    availableTuesday: z.boolean().default(true),
    availableWednesday: z.boolean().default(true),
    availableThursday: z.boolean().default(true),
    availableFriday: z.boolean().default(true),
    availableSaturday: z.boolean().default(false),
    availableSunday: z.boolean().default(false),

    // Additional fields for scheduling
    workHoursStart: z
      .string()
      .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format")
      .optional(),
    workHoursEnd: z
      .string()
      .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format")
      .optional(),
    maxDailyAppointments: z.number().int().positive().default(20).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export type VaccinatorFormValues = z.infer<typeof vaccinatorFormSchema>

/**
 * Get all vaccinators
 */
export async function getVaccinators() {
  try {
    logger.info("Fetching all vaccinators")
    const vaccinators = await vaccinatorService.getAllVaccinators()

    return {
      success: true,
      data: vaccinators,
    }
  } catch (error) {
    logger.error("Error fetching vaccinators", error)

    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch vaccinators",
    }
  }
}

/**
 * Get all departments
 */
export async function getDepartments() {
  try {
    logger.info("Fetching all departments")
    const departments = await vaccinatorService.getAllDepartments()

    return {
      success: true,
      data: departments,
    }
  } catch (error) {
    logger.error("Error fetching departments", error)

    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch departments",
    }
  }
}

/**
 * Create a new vaccinator
 */
export async function createVaccinator(formData: VaccinatorFormValues) {
  try {
    logger.info("Creating new vaccinator", { email: formData.email })

    // Validate the form data
    const validatedData = vaccinatorFormSchema.parse(formData)

    // Create a Supabase auth user
    const supabase = getSupabaseServer()

    // Check if user with this email already exists
    const { data: existingUsers, error: checkError } = await supabase
      .from("vaccinators")
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
      email_confirm: true,
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

    // Create the vaccinator record
    const vaccinatorId = uuidv4()
    const vaccinatorData = {
      id: vaccinatorId,
      auth_id: authData.user.id,
      first_name: validatedData.firstName,
      last_name: validatedData.lastName,
      email: validatedData.email,
      phone: validatedData.phone,
      department_id: validatedData.departmentId,
      specialization: validatedData.specialization || null,
      credentials: validatedData.credentials || null,
      license_number: validatedData.licenseNumber,
      status: validatedData.status,
      available_monday: validatedData.availableMonday,
      available_tuesday: validatedData.availableTuesday,
      available_wednesday: validatedData.availableWednesday,
      available_thursday: validatedData.availableThursday,
      available_friday: validatedData.availableFriday,
      available_saturday: validatedData.availableSaturday,
      available_sunday: validatedData.availableSunday,
      work_hours_start: validatedData.workHoursStart || null,
      work_hours_end: validatedData.workHoursEnd || null,
      max_daily_appointments: validatedData.maxDailyAppointments || 20,
      role: "doctor", // Default role
    }

    const { data: vaccinator, error: vaccinatorError } = await supabase
      .from("vaccinators")
      .insert([vaccinatorData])
      .select()
      .single()

    if (vaccinatorError) {
      logger.error("Error creating vaccinator", vaccinatorError)

      // Try to clean up the auth user if vaccinator creation fails
      try {
        await supabase.auth.admin.deleteUser(authData.user.id)
      } catch (cleanupError) {
        logger.error("Failed to clean up auth user after vaccinator creation error", cleanupError)
      }

      return {
        success: false,
        message: "Error creating vaccinator record: " + vaccinatorError.message,
      }
    }

    if (!vaccinator) {
      logger.error("No data returned from vaccinator creation")

      // Try to clean up the auth user if vaccinator creation fails
      try {
        await supabase.auth.admin.deleteUser(authData.user.id)
      } catch (cleanupError) {
        logger.error("Failed to clean up auth user after vaccinator creation error", cleanupError)
      }

      return {
        success: false,
        message: "Failed to create vaccinator record: No data returned",
      }
    }

    // Revalidate the path to refresh the data
    revalidatePath("/admin/vaccinator-management")

    logger.info("Vaccinator created successfully", { id: vaccinator.id })

    return {
      success: true,
      data: vaccinator,
      message: `Vaccinator ${validatedData.firstName} ${validatedData.lastName} created successfully`,
    }
  } catch (error) {
    logger.error("Error creating vaccinator", error)

    let errorMessage = "Failed to create vaccinator"

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

/**
 * Update an existing vaccinator
 */
export async function updateVaccinator(id: string, formData: VaccinatorFormValues) {
  try {
    logger.info(`Updating vaccinator with id ${id}`, { email: formData.email })

    // Validate the form data
    const validatedData = vaccinatorFormSchema.parse(formData)

    // Get the existing vaccinator to get the auth_id
    const existingVaccinator = await vaccinatorService.getVaccinatorById(id)

    if (!existingVaccinator) {
      return {
        success: false,
        message: "Vaccinator not found",
      }
    }

    // Update the vaccinator data
    const vaccinatorData = {
      first_name: validatedData.firstName,
      last_name: validatedData.lastName,
      email: validatedData.email,
      phone: validatedData.phone,
      department_id: validatedData.departmentId,
      specialization: validatedData.specialization || null,
      credentials: validatedData.credentials || null,
      license_number: validatedData.licenseNumber,
      status: validatedData.status,
      available_monday: validatedData.availableMonday,
      available_tuesday: validatedData.availableTuesday,
      available_wednesday: validatedData.availableWednesday,
      available_thursday: validatedData.availableThursday,
      available_friday: validatedData.availableFriday,
      available_saturday: validatedData.availableSaturday,
      available_sunday: validatedData.availableSunday,
      work_hours_start: validatedData.workHoursStart || null,
      work_hours_end: validatedData.workHoursEnd || null,
      max_daily_appointments: validatedData.maxDailyAppointments || 20,
      updated_at: new Date().toISOString(),
    }

    const vaccinator = await vaccinatorService.updateVaccinator(id, vaccinatorData)

    // Revalidate the path to refresh the data
    revalidatePath("/admin/vaccinator-management")

    logger.info(`Vaccinator with id ${id} updated successfully`)

    return {
      success: true,
      data: vaccinator,
      message: `Vaccinator ${validatedData.firstName} ${validatedData.lastName} updated successfully`,
    }
  } catch (error) {
    logger.error(`Error updating vaccinator with id ${id}`, error)

    let errorMessage = "Failed to update vaccinator"

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

/**
 * Delete an existing vaccinator
 */
export async function deleteVaccinator(id: string) {
  try {
    logger.info(`Deleting vaccinator with id ${id}`)

    // Get the vaccinator to get the auth_id
    const vaccinator = await vaccinatorService.getVaccinatorById(id)

    if (!vaccinator) {
      return {
        success: false,
        message: "Vaccinator not found",
      }
    }

    // Delete the vaccinator
    await vaccinatorService.deleteVaccinator(id)

    // Delete the auth user if auth_id exists
    if (vaccinator.auth_id) {
      const supabase = getSupabaseServer()
      await supabase.auth.admin.deleteUser(vaccinator.auth_id)
    }

    // Revalidate the path to refresh the data
    revalidatePath("/admin/vaccinator-management")

    logger.info(`Vaccinator with id ${id} deleted successfully`)

    return {
      success: true,
      message: `Vaccinator deleted successfully`,
    }
  } catch (error) {
    logger.error(`Error deleting vaccinator with id ${id}`, error)

    let errorMessage = "Failed to delete vaccinator"

    if (error instanceof Error) {
      errorMessage = error.message
    }

    return {
      success: false,
      message: errorMessage,
    }
  }
}
