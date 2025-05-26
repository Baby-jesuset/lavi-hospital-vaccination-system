import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/database.types"

type Appointment = Database["public"]["Tables"]["appointments"]["Row"]
type AppointmentInsert = Database["public"]["Tables"]["appointments"]["Insert"]
type AppointmentUpdate = Database["public"]["Tables"]["appointments"]["Update"]

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
    email: string
  }
  vaccine?: {
    lot_number: string
    vaccine_type: {
      name: string
    }
  }
}

export const AppointmentService = {
  // Get all appointments with patient and vaccinator details
  async getAllAppointments(): Promise<AppointmentWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          patient:patient_id(id, first_name, last_name, email),
          vaccinator:vaccinator_id(id, first_name, last_name, email),
          vaccine:vaccine_id(id, lot_number, vaccine_type:vaccine_type_id(name))
        `)
        .order("appointment_date", { ascending: true })
        .order("appointment_time", { ascending: true })

      if (error) {
        console.error("Error fetching appointments:", error)
        throw error
      }

      return data as unknown as AppointmentWithDetails[]
    } catch (error) {
      console.error("Error in getAllAppointments:", error)
      throw error
    }
  },

  // Get appointments for a specific patient
  async getPatientAppointments(patientId: string): Promise<AppointmentWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          patient:patient_id(id, first_name, last_name, email),
          vaccinator:vaccinator_id(id, first_name, last_name, email),
          vaccine:vaccine_id(id, lot_number, vaccine_type:vaccine_type_id(name))
        `)
        .eq("patient_id", patientId)
        .order("appointment_date", { ascending: true })
        .order("appointment_time", { ascending: true })

      if (error) {
        console.error("Error fetching patient appointments:", error)
        throw error
      }

      return data as unknown as AppointmentWithDetails[]
    } catch (error) {
      console.error("Error in getPatientAppointments:", error)
      throw error
    }
  },

  // Get appointments for a specific vaccinator
  async getVaccinatorAppointments(vaccinatorId: string): Promise<AppointmentWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          patient:patient_id(id, first_name, last_name, email),
          vaccinator:vaccinator_id(id, first_name, last_name, email),
          vaccine:vaccine_id(id, lot_number, vaccine_type:vaccine_type_id(name))
        `)
        .eq("vaccinator_id", vaccinatorId)
        .order("appointment_date", { ascending: true })
        .order("appointment_time", { ascending: true })

      if (error) {
        console.error("Error fetching vaccinator appointments:", error)
        throw error
      }

      return data as unknown as AppointmentWithDetails[]
    } catch (error) {
      console.error("Error in getVaccinatorAppointments:", error)
      throw error
    }
  },

  // Create a new appointment
  async createAppointment(appointment: AppointmentInsert): Promise<Appointment> {
    try {
      const { data, error } = await supabase.from("appointments").insert(appointment).select().single()

      if (error) {
        console.error("Error creating appointment:", error)
        throw error
      }

      return data
    } catch (error) {
      console.error("Error in createAppointment:", error)
      throw error
    }
  },

  // Update an existing appointment
  async updateAppointment(id: string, updates: AppointmentUpdate): Promise<Appointment> {
    try {
      const { data, error } = await supabase.from("appointments").update(updates).eq("id", id).select().single()

      if (error) {
        console.error("Error updating appointment:", error)
        throw error
      }

      return data
    } catch (error) {
      console.error("Error in updateAppointment:", error)
      throw error
    }
  },

  // Cancel an appointment
  async cancelAppointment(id: string): Promise<Appointment> {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", id)
        .select()
        .single()

      if (error) {
        console.error("Error cancelling appointment:", error)
        throw error
      }

      return data
    } catch (error) {
      console.error("Error in cancelAppointment:", error)
      throw error
    }
  },

  // Delete an appointment (typically not recommended, use cancel instead)
  async deleteAppointment(id: string): Promise<void> {
    try {
      const { error } = await supabase.from("appointments").delete().eq("id", id)

      if (error) {
        console.error("Error deleting appointment:", error)
        throw error
      }
    } catch (error) {
      console.error("Error in deleteAppointment:", error)
      throw error
    }
  },

  // Get available time slots for a specific vaccinator on a specific date
  async getAvailableTimeSlots(vaccinatorId: string, date: string): Promise<string[]> {
    try {
      // Get all appointments for the vaccinator on the specified date
      const { data: existingAppointments, error } = await supabase
        .from("appointments")
        .select("appointment_time")
        .eq("vaccinator_id", vaccinatorId)
        .eq("appointment_date", date)
        .not("status", "eq", "cancelled")

      if (error) {
        console.error("Error fetching existing appointments:", error)
        throw error
      }

      // Define all possible time slots (e.g., 9:00 AM to 5:00 PM in 30-minute intervals)
      const allTimeSlots = [
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
      ]

      // Filter out time slots that are already booked
      const bookedTimeSlots = existingAppointments.map((app) => app.appointment_time)
      const availableTimeSlots = allTimeSlots.filter((slot) => !bookedTimeSlots.includes(slot))

      return availableTimeSlots
    } catch (error) {
      console.error("Error in getAvailableTimeSlots:", error)
      throw error
    }
  },
}
