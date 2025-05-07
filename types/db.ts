import type { Database } from "./database.types"

// Export common types from the database
export type Patient = Database["public"]["Tables"]["patients"]["Row"]
export type PatientInsert = Database["public"]["Tables"]["patients"]["Insert"]
export type PatientUpdate = Database["public"]["Tables"]["patients"]["Update"]

export type Vaccinator = Database["public"]["Tables"]["vaccinators"]["Row"]
export type VaccinatorInsert = Database["public"]["Tables"]["vaccinators"]["Insert"]
export type VaccinatorUpdate = Database["public"]["Tables"]["vaccinators"]["Update"]

export type Appointment = Database["public"]["Tables"]["appointments"]["Row"]
export type AppointmentInsert = Database["public"]["Tables"]["appointments"]["Insert"]
export type AppointmentUpdate = Database["public"]["Tables"]["appointments"]["Update"]

export type InventoryItem = Database["public"]["Tables"]["inventory_items"]["Row"]
export type InventoryItemInsert = Database["public"]["Tables"]["inventory_items"]["Insert"]
export type InventoryItemUpdate = Database["public"]["Tables"]["inventory_items"]["Update"]

export type VaccinationRecord = Database["public"]["Tables"]["vaccination_records"]["Row"]
export type VaccinationRecordInsert = Database["public"]["Tables"]["vaccination_records"]["Insert"]
export type VaccinationRecordUpdate = Database["public"]["Tables"]["vaccination_records"]["Update"]

export type Department = Database["public"]["Tables"]["departments"]["Row"]
export type DepartmentInsert = Database["public"]["Tables"]["departments"]["Insert"]
export type DepartmentUpdate = Database["public"]["Tables"]["departments"]["Update"]

export type VaccineType = Database["public"]["Tables"]["vaccine_types"]["Row"]
export type VaccineTypeInsert = Database["public"]["Tables"]["vaccine_types"]["Insert"]
export type VaccineTypeUpdate = Database["public"]["Tables"]["vaccine_types"]["Update"]

export type Manufacturer = Database["public"]["Tables"]["manufacturers"]["Row"]
export type ManufacturerInsert = Database["public"]["Tables"]["manufacturers"]["Insert"]
export type ManufacturerUpdate = Database["public"]["Tables"]["manufacturers"]["Update"]

export type Supplier = Database["public"]["Tables"]["suppliers"]["Row"]
export type SupplierInsert = Database["public"]["Tables"]["suppliers"]["Insert"]
export type SupplierUpdate = Database["public"]["Tables"]["suppliers"]["Update"]

export type StorageLocation = Database["public"]["Tables"]["storage_locations"]["Row"]
export type StorageLocationInsert = Database["public"]["Tables"]["storage_locations"]["Insert"]
export type StorageLocationUpdate = Database["public"]["Tables"]["storage_locations"]["Update"]

// Extended types with joined data
export type PatientWithDetails = Patient & {
  // Add any joined fields here
}

export type VaccinatorWithDetails = Vaccinator & {
  departments?: {
    id: string
    name: string
  }
}

export type AppointmentWithDetails = Appointment & {
  patient: {
    id: string
    first_name: string
    last_name: string
    email: string
  }
  vaccinator: {
    id: string
    first_name: string
    last_name: string
  }
  vaccine?: {
    id: string
    lot_number: string
    vaccine_type: {
      id: string
      name: string
    }
  }
}

export type InventoryItemWithDetails = InventoryItem & {
  vaccine_type: {
    id: string
    name: string
    target_disease: string
  }
  manufacturer: {
    id: string
    name: string
  }
  supplier: {
    id: string
    name: string
  }
  storage_location: {
    id: string
    name: string
    location_type: string
  }
}

export type VaccinationRecordWithDetails = VaccinationRecord & {
  patient: {
    id: string
    first_name: string
    last_name: string
    email: string
  }
  vaccinator: {
    id: string
    first_name: string
    last_name: string
  }
  inventory: {
    id: string
    lot_number: string
    vaccine_type: {
      id: string
      name: string
      target_disease: string
    }
    manufacturer: {
      id: string
      name: string
    }
  }
  appointment?: {
    id: string
    appointment_date: string
    appointment_time: string
  }
}
