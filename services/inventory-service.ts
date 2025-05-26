import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/database.types"

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

export interface VaccineInventory {
  id?: string
  vaccine_name: string
  manufacturer: string
  batch_number: string
  expiration_date: string
  total_doses: number
  available_doses: number
  storage_location: string
  storage_requirements?: {
    temperature?: string
    light?: string
    humidity?: string
  }
  status: "available" | "low_stock" | "out_of_stock" | "expired"
  created_at?: string
  updated_at?: string
  created_by?: string
  updated_by?: string
}

export const InventoryService = {
  // Get all inventory items with details
  async getAllInventoryItems(): Promise<InventoryItemWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from("inventory_items")
        .select(`
          *,
          vaccine_type:vaccine_type_id(id, name, target_disease, recommended_doses),
          manufacturer:manufacturer_id(id, name),
          supplier:supplier_id(id, name),
          storage_location:storage_location_id(id, name, location_type)
        `)
        .order("expiration_date", { ascending: true })

      if (error) {
        console.error("Error fetching inventory items:", error)
        throw error
      }

      return data as unknown as InventoryItemWithDetails[]
    } catch (error) {
      console.error("Error in getAllInventoryItems:", error)
      throw error
    }
  },

  // Get available inventory items (not expired and quantity > 0)
  async getAvailableInventoryItems(): Promise<InventoryItemWithDetails[]> {
    try {
      const today = new Date().toISOString().split("T")[0]

      const { data, error } = await supabase
        .from("inventory_items")
        .select(`
          *,
          vaccine_type:vaccine_type_id(id, name, target_disease, recommended_doses),
          manufacturer:manufacturer_id(id, name),
          supplier:supplier_id(id, name),
          storage_location:storage_location_id(id, name, location_type)
        `)
        .gt("expiration_date", today)
        .gt("quantity_available", 0)
        .order("expiration_date", { ascending: true })

      if (error) {
        console.error("Error fetching available inventory items:", error)
        throw error
      }

      return data as unknown as InventoryItemWithDetails[]
    } catch (error) {
      console.error("Error in getAvailableInventoryItems:", error)
      throw error
    }
  },

  // Get inventory items by vaccine type
  async getInventoryItemsByVaccineType(vaccineTypeId: string): Promise<InventoryItemWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from("inventory_items")
        .select(`
          *,
          vaccine_type:vaccine_type_id(id, name, target_disease, recommended_doses),
          manufacturer:manufacturer_id(id, name),
          supplier:supplier_id(id, name),
          storage_location:storage_location_id(id, name, location_type)
        `)
        .eq("vaccine_type_id", vaccineTypeId)
        .order("expiration_date", { ascending: true })

      if (error) {
        console.error("Error fetching inventory items by vaccine type:", error)
        throw error
      }

      return data as unknown as InventoryItemWithDetails[]
    } catch (error) {
      console.error("Error in getInventoryItemsByVaccineType:", error)
      throw error
    }
  },

  // Create a new inventory item
  async createInventoryItem(item: InventoryItemInsert): Promise<InventoryItem> {
    try {
      const { data, error } = await supabase.from("inventory_items").insert(item).select().single()

      if (error) {
        console.error("Error creating inventory item:", error)
        throw error
      }

      return data
    } catch (error) {
      console.error("Error in createInventoryItem:", error)
      throw error
    }
  },

  // Update an existing inventory item
  async updateInventoryItem(id: string, updates: InventoryItemUpdate): Promise<InventoryItem> {
    try {
      const { data, error } = await supabase.from("inventory_items").update(updates).eq("id", id).select().single()

      if (error) {
        console.error("Error updating inventory item:", error)
        throw error
      }

      return data
    } catch (error) {
      console.error("Error in updateInventoryItem:", error)
      throw error
    }
  },

  // Update inventory quantity
  async updateInventoryQuantity(id: string, quantityChange: number): Promise<InventoryItem> {
    try {
      // First get the current inventory item
      const { data: currentItem, error: fetchError } = await supabase
        .from("inventory_items")
        .select("quantity_available")
        .eq("id", id)
        .single()

      if (fetchError) {
        console.error("Error fetching inventory item:", fetchError)
        throw fetchError
      }

      const newQuantity = (currentItem.quantity_available || 0) + quantityChange

      if (newQuantity < 0) {
        throw new Error("Cannot reduce quantity below zero")
      }

      // Update the quantity
      const { data, error } = await supabase
        .from("inventory_items")
        .update({ quantity_available: newQuantity })
        .eq("id", id)
        .select()
        .single()

      if (error) {
        console.error("Error updating inventory quantity:", error)
        throw error
      }

      return data
    } catch (error) {
      console.error("Error in updateInventoryQuantity:", error)
      throw error
    }
  },

  // Check if an inventory item is available
  async isInventoryItemAvailable(id: string): Promise<boolean> {
    try {
      const today = new Date().toISOString().split("T")[0]

      const { data, error } = await supabase
        .from("inventory_items")
        .select("id, quantity_available, expiration_date")
        .eq("id", id)
        .gt("expiration_date", today)
        .gt("quantity_available", 0)
        .single()

      if (error) {
        console.error("Error checking inventory availability:", error)
        return false
      }

      return !!data
    } catch (error) {
      console.error("Error in isInventoryItemAvailable:", error)
      return false
    }
  },

  // Get all vaccines
  async getAllVaccines(): Promise<VaccineInventory[]> {
    try {
      const { data, error } = await supabase
        .from("vaccine_inventory")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching vaccines:", error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error("Error in getAllVaccines:", error)
      throw error
    }
  },

  // Get a single vaccine by ID
  async getVaccineById(id: string): Promise<VaccineInventory | null> {
    try {
      const { data, error } = await supabase.from("vaccine_inventory").select("*").eq("id", id).single()

      if (error) {
        console.error("Error fetching vaccine:", error)
        throw error
      }

      return data
    } catch (error) {
      console.error(`Error in getVaccineById for ID ${id}:`, error)
      throw error
    }
  },

  // Add a new vaccine
  async addVaccine(vaccine: VaccineInventory): Promise<VaccineInventory> {
    try {
      // Get the current user ID for created_by
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const newVaccine = {
        ...vaccine,
        created_by: user?.id,
        updated_by: user?.id,
      }

      const { data, error } = await supabase.from("vaccine_inventory").insert([newVaccine]).select().single()

      if (error) {
        console.error("Error adding vaccine:", error)
        throw error
      }

      return data
    } catch (error) {
      console.error("Error in addVaccine:", error)
      throw error
    }
  },

  // Update a vaccine
  async updateVaccine(id: string, updates: Partial<VaccineInventory>): Promise<VaccineInventory> {
    try {
      // Get the current user ID for updated_by
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const updatedVaccine = {
        ...updates,
        updated_by: user?.id,
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from("vaccine_inventory")
        .update(updatedVaccine)
        .eq("id", id)
        .select()
        .single()

      if (error) {
        console.error("Error updating vaccine:", error)
        throw error
      }

      return data
    } catch (error) {
      console.error(`Error in updateVaccine for ID ${id}:`, error)
      throw error
    }
  },

  // Delete a vaccine
  async deleteVaccine(id: string): Promise<void> {
    try {
      const { error } = await supabase.from("vaccine_inventory").delete().eq("id", id)

      if (error) {
        console.error("Error deleting vaccine:", error)
        throw error
      }
    } catch (error) {
      console.error(`Error in deleteVaccine for ID ${id}:`, error)
      throw error
    }
  },

  // Get vaccines by status
  async getVaccinesByStatus(status: string): Promise<VaccineInventory[]> {
    try {
      const { data, error } = await supabase
        .from("vaccine_inventory")
        .select("*")
        .eq("status", status)
        .order("expiration_date", { ascending: true })

      if (error) {
        console.error("Error fetching vaccines by status:", error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error(`Error in getVaccinesByStatus for status ${status}:`, error)
      throw error
    }
  },

  // Get vaccines that are about to expire (within the next 30 days)
  async getExpiringVaccines(daysThreshold = 30): Promise<VaccineInventory[]> {
    try {
      const today = new Date()
      const futureDate = new Date()
      futureDate.setDate(today.getDate() + daysThreshold)

      const { data, error } = await supabase
        .from("vaccine_inventory")
        .select("*")
        .gte("expiration_date", today.toISOString().split("T")[0])
        .lte("expiration_date", futureDate.toISOString().split("T")[0])
        .order("expiration_date", { ascending: true })

      if (error) {
        console.error("Error fetching expiring vaccines:", error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error("Error in getExpiringVaccines:", error)
      throw error
    }
  },

  // Update vaccine stock
  async updateVaccineStock(id: string, dosesUsed: number): Promise<VaccineInventory> {
    try {
      // First get the current vaccine
      const { data: currentVaccine, error: fetchError } = await supabase
        .from("vaccine_inventory")
        .select("available_doses, status")
        .eq("id", id)
        .single()

      if (fetchError) {
        console.error("Error fetching current vaccine:", fetchError)
        throw fetchError
      }

      const newAvailableDoses = Math.max(0, currentVaccine.available_doses - dosesUsed)

      // Determine the new status based on available doses
      let newStatus = currentVaccine.status
      if (newAvailableDoses === 0) {
        newStatus = "out_of_stock"
      } else if (newAvailableDoses <= 10) {
        // Assuming 10 is the threshold for low stock
        newStatus = "low_stock"
      }

      // Update the vaccine
      return await this.updateVaccine(id, {
        available_doses: newAvailableDoses,
        status: newStatus as "available" | "low_stock" | "out_of_stock" | "expired",
      })
    } catch (error) {
      console.error(`Error in updateVaccineStock for ID ${id}:`, error)
      throw error
    }
  },
}
