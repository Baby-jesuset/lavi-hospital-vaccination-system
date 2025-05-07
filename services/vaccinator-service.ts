import { getSupabaseServer } from "@/lib/supabase-client"
import { createLogger } from "@/utils/logging"
import type { Database } from "@/types/database.types"

// Create a logger for this service
const logger = createLogger("vaccinatorService")

// Define types for the vaccinator service
export type Vaccinator = Database["public"]["Tables"]["vaccinators"]["Row"]
export type Department = Database["public"]["Tables"]["departments"]["Row"]

// Extended vaccinator type with joined data
// export type VaccinatorWithDetails = Vaccinator & {
//   departments?: {
//     id: string
//     name: string
//   }
// }

// Define the vaccinator service
export const vaccinatorService = {
  /**
   * Get all vaccinators
   */
  async getAllVaccinators(): Promise<Vaccinator[]> {
    try {
      const supabase = getSupabaseServer()
      const { data, error } = await supabase
        .from("vaccinators")
        .select(`
          *,
          departments(id, name)
        `)
        .order("last_name", { ascending: true })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      logger.error("Error fetching vaccinators", error)
      throw error
    }
  },

  /**
   * Get a vaccinator by ID
   */
  async getVaccinatorById(id: string): Promise<Vaccinator | null> {
    try {
      const supabase = getSupabaseServer()
      const { data, error } = await supabase
        .from("vaccinators")
        .select(`
          *,
          departments(id, name)
        `)
        .eq("id", id)
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      logger.error(`Error fetching vaccinator with id ${id}`, error)
      throw error
    }
  },

  /**
   * Get all departments
   */
  async getAllDepartments(): Promise<Department[]> {
    try {
      const supabase = getSupabaseServer()
      const { data, error } = await supabase.from("departments").select("*").order("name", { ascending: true })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      logger.error("Error fetching departments", error)
      throw error
    }
  },

  /**
   * Create a new vaccinator
   */
  async createVaccinator(vaccinatorData: Partial<Vaccinator>): Promise<Vaccinator> {
    try {
      const supabase = getSupabaseServer()
      const { data, error } = await supabase.from("vaccinators").insert([vaccinatorData]).select().single()

      if (error) {
        throw error
      }

      if (!data) {
        throw new Error("No data returned from vaccinator creation")
      }

      return data
    } catch (error) {
      logger.error("Error creating vaccinator", error)
      throw error
    }
  },

  /**
   * Update an existing vaccinator
   */
  async updateVaccinator(id: string, vaccinatorData: Partial<Vaccinator>): Promise<Vaccinator> {
    try {
      const supabase = getSupabaseServer()
      const { data, error } = await supabase.from("vaccinators").update(vaccinatorData).eq("id", id).select().single()

      if (error) {
        throw error
      }

      if (!data) {
        throw new Error("No data returned from vaccinator update")
      }

      return data
    } catch (error) {
      logger.error(`Error updating vaccinator with id ${id}`, error)
      throw error
    }
  },

  /**
   * Delete a vaccinator
   */
  async deleteVaccinator(id: string): Promise<void> {
    try {
      const supabase = getSupabaseServer()
      const { error } = await supabase.from("vaccinators").delete().eq("id", id)

      if (error) {
        throw error
      }
    } catch (error) {
      logger.error(`Error deleting vaccinator with id ${id}`, error)
      throw error
    }
  },
}
