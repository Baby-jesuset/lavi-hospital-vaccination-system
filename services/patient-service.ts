import { getSupabaseServer } from "@/lib/supabase-client"
import { createLogger } from "@/utils/logging"

const logger = createLogger("patientService")

// Define the patient service
export const patientService = {
  /**
   * Get all patients
   */
  async getAllPatients() {
    try {
      const supabase = getSupabaseServer()
      const { data, error } = await supabase.from("patients").select("*").order("last_name", { ascending: true })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      logger.error("Error fetching patients", error)
      throw error
    }
  },

  /**
   * Get a patient by ID
   */
  async getPatientById(id: string) {
    try {
      const supabase = getSupabaseServer()
      const { data, error } = await supabase.from("patients").select("*").eq("id", id).single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      logger.error(`Error fetching patient with id ${id}`, error)
      throw error
    }
  },

  /**
   * Get a patient by auth ID
   */
  async getPatientByAuthId(authId: string) {
    try {
      const supabase = getSupabaseServer()
      const { data, error } = await supabase.from("patients").select("*").eq("auth_id", authId).single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      logger.error(`Error fetching patient with auth id ${authId}`, error)
      throw error
    }
  },

  /**
   * Create a new patient
   */
  async createPatient(patientData: any) {
    try {
      const supabase = getSupabaseServer()
      const { data, error } = await supabase.from("patients").insert([patientData]).select().single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      logger.error("Error creating patient", error)
      throw error
    }
  },

  /**
   * Update an existing patient
   */
  async updatePatient(id: string, patientData: any) {
    try {
      const supabase = getSupabaseServer()
      const { data, error } = await supabase.from("patients").update(patientData).eq("id", id).select().single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      logger.error(`Error updating patient with id ${id}`, error)
      throw error
    }
  },

  /**
   * Delete a patient
   */
  async deletePatient(id: string) {
    try {
      const supabase = getSupabaseServer()
      const { error } = await supabase.from("patients").delete().eq("id", id)

      if (error) {
        throw error
      }
    } catch (error) {
      logger.error(`Error deleting patient with id ${id}`, error)
      throw error
    }
  },
}
