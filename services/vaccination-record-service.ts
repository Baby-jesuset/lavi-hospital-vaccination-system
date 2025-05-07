import { getSupabaseServer } from "@/lib/supabase-client"
import type { Database } from "@/types/database.types"
import { createLogger } from "@/utils/logging"

const logger = createLogger("vaccinationRecordService")

type VaccinationRecord = Database["public"]["Tables"]["vaccination_records"]["Row"]
type VaccinationRecordInsert = Database["public"]["Tables"]["vaccination_records"]["Insert"]
type VaccinationRecordUpdate = Database["public"]["Tables"]["vaccination_records"]["Update"]

// Extended vaccination record type with joined data
export type VaccinationRecordWithDetails = VaccinationRecord & {
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
  inventory: {
    lot_number: string
    vaccine_type: {
      name: string
      target_disease: string
    }
    manufacturer: {
      name: string
    }
  }
}

// Define the vaccination record service
export const vaccinationRecordService = {
  /**
   * Get all vaccination records
   */
  async getAllVaccinationRecords() {
    try {
      const supabase = getSupabaseServer()
      const { data, error } = await supabase
        .from("vaccination_records")
        .select(`
          *,
          patients(id, first_name, last_name),
          vaccinators(id, first_name, last_name),
          vaccines(id, name, manufacturer)
        `)
        .order("vaccination_date", { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      logger.error("Error fetching vaccination records", error)
      throw error
    }
  },

  /**
   * Get vaccination records for a specific patient
   */
  async getVaccinationRecordsByPatientId(patientId: string) {
    try {
      const supabase = getSupabaseServer()
      const { data, error } = await supabase
        .from("vaccination_records")
        .select(`
          *,
          vaccinators(id, first_name, last_name),
          vaccines(id, name, manufacturer, recommended_doses, dose_interval)
        `)
        .eq("patient_id", patientId)
        .order("vaccination_date", { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      logger.error(`Error fetching vaccination records for patient ${patientId}`, error)
      throw error
    }
  },

  /**
   * Get vaccination records for a specific vaccinator
   */
  async getVaccinationRecordsByVaccinatorId(vaccinatorId: string) {
    try {
      const supabase = getSupabaseServer()
      const { data, error } = await supabase
        .from("vaccination_records")
        .select(`
          *,
          patients(id, first_name, last_name),
          vaccines(id, name, manufacturer)
        `)
        .eq("vaccinator_id", vaccinatorId)
        .order("vaccination_date", { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      logger.error(`Error fetching vaccination records for vaccinator ${vaccinatorId}`, error)
      throw error
    }
  },

  /**
   * Get a vaccination record by ID
   */
  async getVaccinationRecordById(id: string) {
    try {
      const supabase = getSupabaseServer()
      const { data, error } = await supabase
        .from("vaccination_records")
        .select(`
          *,
          patients(id, first_name, last_name),
          vaccinators(id, first_name, last_name),
          vaccines(id, name, manufacturer)
        `)
        .eq("id", id)
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      logger.error(`Error fetching vaccination record with id ${id}`, error)
      throw error
    }
  },

  /**
   * Create a new vaccination record
   */
  async createVaccinationRecord(recordData: any) {
    try {
      const supabase = getSupabaseServer()
      const { data, error } = await supabase.from("vaccination_records").insert([recordData]).select().single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      logger.error("Error creating vaccination record", error)
      throw error
    }
  },

  /**
   * Update an existing vaccination record
   */
  async updateVaccinationRecord(id: string, recordData: any) {
    try {
      const supabase = getSupabaseServer()
      const { data, error } = await supabase
        .from("vaccination_records")
        .update(recordData)
        .eq("id", id)
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      logger.error(`Error updating vaccination record with id ${id}`, error)
      throw error
    }
  },

  /**
   * Delete a vaccination record
   */
  async deleteVaccinationRecord(id: string) {
    try {
      const supabase = getSupabaseServer()
      const { error } = await supabase.from("vaccination_records").delete().eq("id", id)

      if (error) {
        throw error
      }
    } catch (error) {
      logger.error(`Error deleting vaccination record with id ${id}`, error)
      throw error
    }
  },
}
