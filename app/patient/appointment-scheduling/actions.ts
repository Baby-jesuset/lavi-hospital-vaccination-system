"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { createLogger } from "@/utils/logging"
import { getSupabaseServer } from "@/lib/supabase-client"
import { v4 as uuidv4 } from "uuid"
import { appointmentService } from "@/services/appointment-service"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase-client"
import { AppointmentService } from "@/services/appointment-service"

const logger = createLogger("appointmentActions")

// Define the appointment form schema with Zod
export const appointmentFormSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  vaccinatorId: z.string().min(1, "Vaccinator ID is required"),
  appointmentDate: z.string().min(1, "Appointment date is required"),
  appointmentTime: z.string().min(1, "Appointment time is required"),
  appointmentType: z.enum(["vaccination", "consultation", "follow_up"]).default("vaccination"),
  notes: z.string().optional(),
})

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>

export async function getAvailableVaccinators() {
  try {
    logger.info("Fetching available vaccinators")
    const supabase = getSupabaseServer()

    const { data, error } = await supabase
      .from("vaccinators")
      .select(`
        id,
        first_name,
        last_name,
        department_id,
        departments(id, name)
      `)
      .eq("status", "active")
      .order("last_name", { ascending: true })

    if (error) {
      throw error
    }

    return {
      success: true,
      data: data || [],
    }
  } catch (error) {
    logger.error("Error fetching available vaccinators", error)

    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch available vaccinators",
    }
  }
}

export async function getAvailableTimeSlots(vaccinatorId: string, date: string) {
  try {
    logger.info(`Fetching available time slots for vaccinator ${vaccinatorId} on ${date}`)

    const timeSlots = await appointmentService.getAvailableTimeSlots(vaccinatorId, date)

    return {
      success: true,
      data: timeSlots,
    }
  } catch (error) {
    logger.error(`Error fetching available time slots for vaccinator ${vaccinatorId} on ${date}`, error)

    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch available time slots",
    }
  }
}

export async function createAppointment(formData: AppointmentFormValues) {
  try {
    logger.info("Creating new appointment", { patientId: formData.patientId, vaccinatorId: formData.vaccinatorId })

    // Validate the form data
    const validatedData = appointmentFormSchema.parse(formData)

    // Create the appointment
    const appointmentId = uuidv4()
    const appointmentData = {
      id: appointmentId,
      patient_id: validatedData.patientId,
      vaccinator_id: validatedData.vaccinatorId,
      appointment_date: validatedData.appointmentDate,
      appointment_time: validatedData.appointmentTime,
      appointment_type: validatedData.appointmentType,
      notes: validatedData.notes || null,
      status: "scheduled",
    }

    const appointment = await appointmentService.createAppointment(appointmentData)

    // Revalidate the path to refresh the data
    revalidatePath("/patient/appointment-scheduling")
    revalidatePath("/patient/dashboard")

    logger.info("Appointment created successfully", { id: appointment.id })

    return {
      success: true,
      data: appointment,
      message: "Appointment scheduled successfully!",
    }
  } catch (error) {
    logger.error("Error creating appointment", error)

    let errorMessage = "Failed to schedule appointment"

    if (error instanceof Error) {
      errorMessage = error.message
    }

    return {
      success: false,
      message: errorMessage,
    }
  }
}

// Export scheduleAppointment for backward compatibility
export async function scheduleAppointment(formData: any) {
  try {
    // Validate form data
    const validatedData = z
      .object({
        // Foreign keys
        vaccinatorId: z.string().min(1, "Please select a vaccinator"),
        vaccineId: z.string().optional(),

        // Appointment details
        purpose: z.string({
          required_error: "Please select a purpose for your visit",
        }),

        // Date and time
        date: z
          .string({
            required_error: "Please select a date",
          })
          .refine((date) => new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0)), {
            message: "Appointment date cannot be in the past",
          }),
        startTime: z
          .string({
            required_error: "Please select a time",
          })
          .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),

        // Additional information
        notes: z.string().optional(),

        // Notification preferences
        notifyByEmail: z.boolean().default(true),
        notifyBySms: z.boolean().default(false),
      })
      .parse(formData)

    // Get the current user
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: "You must be logged in to schedule an appointment" }
    }

    // Get the patient ID for the current user
    const { data: patientData, error: patientError } = await supabase
      .from("patients")
      .select("id")
      .eq("auth_id", user.id)
      .single()

    if (patientError || !patientData) {
      return { success: false, error: "Patient profile not found" }
    }

    // Create the appointment
    await AppointmentService.createAppointment({
      patient_id: patientData.id,
      vaccinator_id: validatedData.vaccinatorId,
      vaccine_id: validatedData.vaccineId || null,
      appointment_date: validatedData.date,
      appointment_time: validatedData.startTime,
      notes: validatedData.notes || null,
      status: "scheduled",
    })

    // Revalidate the appointments page to show the new appointment
    revalidatePath("/patient/appointment-scheduling")
    revalidatePath("/patient/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error scheduling appointment:", error)

    if (error instanceof z.ZodError) {
      // Return validation errors
      const fieldErrors = error.errors.reduce(
        (acc, curr) => {
          const field = curr.path[0]
          acc[field] = curr.message
          return acc
        },
        {} as Record<string, string>,
      )

      return {
        success: false,
        error: "Validation failed",
        fieldErrors,
      }
    }

    if (error instanceof Error) {
      return { success: false, error: error.message }
    }

    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function cancelPatientAppointment(appointmentId: string) {
  try {
    // Get the current user
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: "You must be logged in to cancel an appointment" }
    }

    // Get the patient ID for the current user
    const { data: patientData, error: patientError } = await supabase
      .from("patients")
      .select("id")
      .eq("auth_id", user.id)
      .single()

    if (patientError || !patientData) {
      return { success: false, error: "Patient profile not found" }
    }

    // Verify that the appointment belongs to the patient
    const appointment = await AppointmentService.getAppointmentById(appointmentId)

    if (!appointment) {
      return { success: false, error: "Appointment not found" }
    }

    if (appointment.patient_id !== patientData.id) {
      return { success: false, error: "You do not have permission to cancel this appointment" }
    }

    // Cancel the appointment
    await AppointmentService.cancelAppointment(appointmentId)

    // Revalidate the appointments page
    revalidatePath("/patient/appointment-scheduling")
    revalidatePath("/patient/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error cancelling appointment:", error)

    if (error instanceof Error) {
      return { success: false, error: error.message }
    }

    return { success: false, error: "An unexpected error occurred" }
  }
}
