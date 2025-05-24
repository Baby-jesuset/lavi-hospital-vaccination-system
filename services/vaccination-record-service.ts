import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/database.types"

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

export const VaccinationRecordService = {
  // Get all vaccination records with details
  async getAllVaccinationRecords(): Promise<VaccinationRecordWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from("vaccination_records")
        .select(`
          *,
          patient:patient_id(id, first_name, last_name, email),
          vaccinator:vaccinator_id(id, first_name, last_name, email),
          inventory:inventory_id(
            id, 
            lot_number, 
            vaccine_type:vaccine_type_id(name, target_disease),
            manufacturer:manufacturer_id(name)
          )
        `)
        .order("date_administered", { ascending: false })

      if (error) {
        console.error("Error fetching vaccination records:", error)
        throw error
      }

      return data as unknown as VaccinationRecordWithDetails[]
    } catch (error) {
      console.error("Error in getAllVaccinationRecords:", error)
      throw error
    }
  },

  // Get vaccination records for a specific patient
  async getPatientVaccinationRecords(patientId: string): Promise<VaccinationRecordWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from("vaccination_records")
        .select(`
          *,
          patient:patient_id(id, first_name, last_name, email),
          vaccinator:vaccinator_id(id, first_name, last_name, email),
          inventory:inventory_id(
            id, 
            lot_number, 
            vaccine_type:vaccine_type_id(name, target_disease),
            manufacturer:manufacturer_id(name)
          )
        `)
        .eq("patient_id", patientId)
        .order("date_administered", { ascending: false })

      if (error) {
        console.error("Error fetching patient vaccination records:", error)
        throw error
      }

      return data as unknown as VaccinationRecordWithDetails[]
    } catch (error) {
      console.error("Error in getPatientVaccinationRecords:", error)
      throw error
    }
  },

  // Create a new vaccination record
  async createVaccinationRecord(record: VaccinationRecordInsert): Promise<VaccinationRecord> {
    try {
      // Start a transaction to update inventory and create the record
      const { data, error } = await supabase.rpc("create_vaccination_record", {
        record_data: record,
      })

      if (error) {
        console.error("Error creating vaccination record:", error)
        throw error
      }

      return data
    } catch (error) {
      console.error("Error in createVaccinationRecord:", error)
      throw error
    }
  },

  // Update an existing vaccination record
  async updateVaccinationRecord(id: string, updates: VaccinationRecordUpdate): Promise<VaccinationRecord> {
    try {
      const { data, error } = await supabase.from("vaccination_records").update(updates).eq("id", id).select().single()

      if (error) {
        console.error("Error updating vaccination record:", error)
        throw error
      }

      return data
    } catch (error) {
      console.error("Error in updateVaccinationRecord:", error)
      throw error
    }
  },

  // Get a vaccination certificate by ID
  async getVaccinationCertificate(certificateId: string): Promise<VaccinationRecordWithDetails | null> {
    try {
      const { data, error } = await supabase
        .from("vaccination_records")
        .select(`
          *,
          patient:patient_id(id, first_name, last_name, email),
          vaccinator:vaccinator_id(id, first_name, last_name, email),
          inventory:inventory_id(
            id, 
            lot_number, 
            vaccine_type:vaccine_type_id(name, target_disease),
            manufacturer:manufacturer_id(name)
          )
        `)
        .eq("certificate_id", certificateId)
        .single()

      if (error) {
        console.error("Error fetching vaccination certificate:", error)
        return null
      }

      return data as unknown as VaccinationRecordWithDetails
    } catch (error) {
      console.error("Error in getVaccinationCertificate:", error)
      return null
    }
  },
}
