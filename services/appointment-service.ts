import type { Database } from "@/types/database.types"
import { getSupabaseServer } from "@/lib/supabase-client"
import { createLogger } from "@/utils/logging"

const logger = createLogger("appointmentService")

export type Appointment = Database["public"]["Tables"]["appointments"]["Row"]
export type AppointmentInsert = Database["public"]["Tables"]["appointments"]["Insert"]
export type AppointmentUpdate = Database["public"]["Tables"]["appointments"]["Update"]

// Extended appointment type with joined data
export type AppointmentWithDetails = Appointment & {
  patient: {
    first_name: string
    last_name: string
    email: string
  }
  vaccinator: {
    first_name: string
    last_name: string
  }
  vaccine?: {
    lot_number: string
    vaccine_type: {
      name: string
    }
  }
}

// Define the appointment service
export const AppointmentService = {
  /**
   * Get all appointments
   */
  async getAllAppointments() {
    try {
      const supabase = getSupabaseServer()
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          patients(id, first_name, last_name),
          vaccinators(id, first_name, last_name)
        `)
        .order("appointment_date", { ascending: true })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      logger.error("Error fetching appointments", error)
      throw error
    }
  },

  /**
   * Get appointments for a specific patient
   */
  async getAppointmentsByPatientId(patientId: string) {
    try {
      const supabase = getSupabaseServer()
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          vaccinators(id, first_name, last_name, department_id, departments(id, name))
        `)
        .eq("patient_id", patientId)
        .order("appointment_date", { ascending: true })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      logger.error(`Error fetching appointments for patient ${patientId}`, error)
      throw error
    }
  },

  /**
   * Get appointments for a specific vaccinator
   */
  async getAppointmentsByVaccinatorId(vaccinatorId: string) {
    try {
      const supabase = getSupabaseServer()
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          patients(id, first_name, last_name)
        `)
        .eq("vaccinator_id", vaccinatorId)
        .order("appointment_date", { ascending: true })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      logger.error(`Error fetching appointments for vaccinator ${vaccinatorId}`, error)
      throw error
    }
  },

  /**
   * Get an appointment by ID
   */
  async getAppointmentById(id: string) {
    try {
      const supabase = getSupabaseServer()
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          patients(id, first_name, last_name),
          vaccinators(id, first_name, last_name)
        `)
        .eq("id", id)
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      logger.error(`Error fetching appointment with id ${id}`, error)
      throw error
    }
  },

  /**
   * Create a new appointment
   */
  async createAppointment(appointmentData: any) {
    try {
      const supabase = getSupabaseServer()
      const { data, error } = await supabase.from("appointments").insert([appointmentData]).select().single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      logger.error("Error creating appointment", error)
      throw error
    }
  },

  /**
   * Update an existing appointment
   */
  async updateAppointment(id: string, appointmentData: any) {
    try {
      const supabase = getSupabaseServer()
      const { data, error } = await supabase.from("appointments").update(appointmentData).eq("id", id).select().single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      logger.error(`Error updating appointment with id ${id}`, error)
      throw error
    }
  },

  /**
   * Delete an appointment
   */
  async deleteAppointment(id: string) {
    try {
      const supabase = getSupabaseServer()
      const { error } = await supabase.from("appointments").delete().eq("id", id)

      if (error) {
        throw error
      }
    } catch (error) {
      logger.error(`Error deleting appointment with id ${id}`, error)
      throw error
    }
  },

  /**
   * Get available time slots for a vaccinator on a specific date
   */
  async getAvailableTimeSlots(vaccinatorId: string, date: string) {
    try {
      const supabase = getSupabaseServer()

      // First, get the vaccinator's working hours and availability
      const { data: vaccinator, error: vaccinatorError } = await supabase
        .from("vaccinators")
        .select("*")
        .eq("id", vaccinatorId)
        .single()

      if (vaccinatorError) {
        throw vaccinatorError
      }

      if (!vaccinator) {
        throw new Error("Vaccinator not found")
      }

      // Check if the vaccinator is available on the selected day
      const dayOfWeek = new Date(date).getDay() // 0 = Sunday, 1 = Monday, etc.
      const availabilityFields = [
        "available_sunday",
        "available_monday",
        "available_tuesday",
        "available_wednesday",
        "available_thursday",
        "available_friday",
        "available_saturday",
      ]

      const isAvailable = vaccinator[availabilityFields[dayOfWeek]]

      if (!isAvailable) {
        return []
      }

      // Get the vaccinator's working hours
      const startTime = vaccinator.work_hours_start || "09:00"
      const endTime = vaccinator.work_hours_end || "17:00"

      // Get existing appointments for the vaccinator on the selected date
      const { data: existingAppointments, error: appointmentsError } = await supabase
        .from("appointments")
        .select("appointment_time")
        .eq("vaccinator_id", vaccinatorId)
        .eq("appointment_date", date)

      if (appointmentsError) {
        throw appointmentsError
      }

      // Generate available time slots
      const timeSlots = []
      const [startHour, startMinute] = startTime.split(":").map(Number)
      const [endHour, endMinute] = endTime.split(":").map(Number)

      const startDateTime = new Date()
      startDateTime.setHours(startHour, startMinute, 0, 0)

      const endDateTime = new Date()
      endDateTime.setHours(endHour, endMinute, 0, 0)

      // Generate time slots in 30-minute intervals
      const slotDuration = 30 // minutes
      const maxAppointments = vaccinator.max_daily_appointments || 20

      // Create a map of existing appointment times for quick lookup
      const bookedTimes = new Set(existingAppointments?.map((a) => a.appointment_time) || [])

      // Generate time slots
      const currentTime = new Date(startDateTime)
      while (currentTime < endDateTime && timeSlots.length < maxAppointments) {
        const timeString = currentTime.toTimeString().substring(0, 5) // Format: HH:MM

        // Check if this time slot is already booked
        if (!bookedTimes.has(timeString)) {
          timeSlots.push(timeString)
        }

        // Move to the next time slot
        currentTime.setMinutes(currentTime.getMinutes() + slotDuration)
      }

      return timeSlots
    } catch (error) {
      logger.error(`Error getting available time slots for vaccinator ${vaccinatorId} on ${date}`, error)
      throw error
    }
  },

  /**
   * Cancel an appointment
   */
  async cancelAppointment(id: string): Promise<Appointment> {
    try {
      const supabase = getSupabaseServer()
      const { data, error } = await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", id)
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      logger.error(`Error cancelling appointment with id ${id}`, error)
      throw error
    }
  },
}

// Export as appointmentService for backward compatibility
export const appointmentService = AppointmentService
