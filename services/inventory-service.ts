import type { Database } from "@/types/database.types"
import { getSupabaseServer } from "@/lib/supabase-client"
import { createLogger } from "@/utils/logging"

const logger = createLogger("inventoryService")

type InventoryItem = Database["public"]["Tables"]["inventory_items"]["Row"]
type InventoryItemInsert = Database["public"]["Tables"]["inventory_items"]["Insert"]
type InventoryItemUpdate = Database["public"]["Tables"]["inventory_items"]["Update"]

// Extended inventory item type with joined data
export type InventoryItemWithDetails = InventoryItem & {
  vaccine_type: {
    name: string
    target_disease: string
    recommended_doses: number | null
  }
  manufacturer: {
    name: string
  }
  supplier?: {
    name: string
  }
  storage_location?: {
    name: string
    location_type: string
  }
}

// Define the inventory service
export const inventoryService = {
  /**
   * Get all vaccines
   */
  async getAllVaccines() {
    try {
      const supabase = getSupabaseServer()
      const { data, error } = await supabase.from("vaccines").select("*").order("name", { ascending: true })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      logger.error("Error fetching vaccines", error)
      throw error
    }
  },

  /**
   * Get a vaccine by ID
   */
  async getVaccineById(id: string) {
    try {
      const supabase = getSupabaseServer()
      const { data, error } = await supabase.from("vaccines").select("*").eq("id", id).single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      logger.error(`Error fetching vaccine with id ${id}`, error)
      throw error
    }
  },

  /**
   * Create a new vaccine
   */
  async createVaccine(vaccineData: any) {
    try {
      const supabase = getSupabaseServer()
      const { data, error } = await supabase.from("vaccines").insert([vaccineData]).select().single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      logger.error("Error creating vaccine", error)
      throw error
    }
  },

  /**
   * Update an existing vaccine
   */
  async updateVaccine(id: string, vaccineData: any) {
    try {
      const supabase = getSupabaseServer()
      const { data, error } = await supabase.from("vaccines").update(vaccineData).eq("id", id).select().single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      logger.error(`Error updating vaccine with id ${id}`, error)
      throw error
    }
  },

  /**
   * Delete a vaccine
   */
  async deleteVaccine(id: string) {
    try {
      const supabase = getSupabaseServer()
      const { error } = await supabase.from("vaccines").delete().eq("id", id)

      if (error) {
        throw error
      }
    } catch (error) {
      logger.error(`Error deleting vaccine with id ${id}`, error)
      throw error
    }
  },

  /**
   * Get all inventory items
   */
  async getAllInventoryItems() {
    try {
      const supabase = getSupabaseServer()
      const { data, error } = await supabase
        .from("inventory")
        .select(`
          *,
          vaccines(id, name, manufacturer)
        `)
        .order("expiry_date", { ascending: true })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      logger.error("Error fetching inventory items", error)
      throw error
    }
  },

  /**
   * Get an inventory item by ID
   */
  async getInventoryItemById(id: string) {
    try {
      const supabase = getSupabaseServer()
      const { data, error } = await supabase
        .from("inventory")
        .select(`
          *,
          vaccines(id, name, manufacturer)
        `)
        .eq("id", id)
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      logger.error(`Error fetching inventory item with id ${id}`, error)
      throw error
    }
  },

  /**
   * Create a new inventory item
   */
  async createInventoryItem(inventoryData: any) {
    try {
      const supabase = getSupabaseServer()
      const { data, error } = await supabase.from("inventory").insert([inventoryData]).select().single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      logger.error("Error creating inventory item", error)
      throw error
    }
  },

  /**
   * Update an existing inventory item
   */
  async updateInventoryItem(id: string, inventoryData: any) {
    try {
      const supabase = getSupabaseServer()
      const { data, error } = await supabase.from("inventory").update(inventoryData).eq("id", id).select().single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      logger.error(`Error updating inventory item with id ${id}`, error)
      throw error
    }
  },

  /**
   * Delete an inventory item
   */
  async deleteInventoryItem(id: string) {
    try {
      const supabase = getSupabaseServer()
      const { error } = await supabase.from("inventory").delete().eq("id", id)

      if (error) {
        throw error
      }
    } catch (error) {
      logger.error(`Error deleting inventory item with id ${id}`, error)
      throw error
    }
  },
}
