/**
 * Supabase Database Types
 * These interfaces represent the structure of our database tables
 */

// Common types
export type UUID = string
export type Timestamp = string
export type Status = "active" | "inactive" | "pending" | "archived"

// User roles
export type UserRole = "admin" | "doctor" | "patient"

// Base entity with common fields
interface BaseEntity {
  created_at: Timestamp
  updated_at: Timestamp
}

// Patient table - updated with patient_id
export interface Patient extends BaseEntity {
  patient_id: UUID // Primary key
  user_id: UUID // Foreign key to auth.users
  first_name: string
  last_name: string
  email: string
  phone: string
  date_of_birth: string
  gender?: "male" | "female" | "other" | "prefer_not_to_say"

  // Address fields
  street?: string
  city?: string
  state?: string
  zip_code?: string
  country?: string

  // Medical information
  medical_history?: string
  allergies?: string
  current_medications?: string

  // Emergency contact
  emergency_contact_name?: string
  emergency_contact_phone?: string
  emergency_contact_relationship?: string

  // System fields
  status: "active" | "inactive" | "pending_verification"
  registration_date: Timestamp
}

// Vaccinator table - updated with vaccinator_id
export interface Vaccinator extends BaseEntity {
  vaccinator_id: UUID // Primary key
  user_id: UUID // Foreign key to auth.users
  first_name: string
  last_name: string
  email: string
  phone: string
  department_id: UUID // Foreign key to departments table
  specialization?: string
  credentials?: string
  license_number: string

  // System fields
  status: "active" | "inactive" | "on_leave"

  // Work schedule (could be normalized to a separate table)
  available_monday: boolean
  available_tuesday: boolean
  available_wednesday: boolean
  available_thursday: boolean
  available_friday: boolean
  available_saturday: boolean
  available_sunday: boolean
  work_hours_start?: string // Time format: HH:MM
  work_hours_end?: string // Time format: HH:MM
  max_daily_appointments?: number
}

// Department table
export interface Department extends BaseEntity {
  id: UUID
  name: string
  description?: string
}

// Appointment table - updated with appointment_id
export interface Appointment extends BaseEntity {
  appointment_id: UUID // Primary key
  patient_id: UUID // Foreign key to patients table
  vaccinator_id: UUID // Foreign key to vaccinators table
  vaccine_id?: UUID // Foreign key to inventory table
  location_id?: UUID // Foreign key to locations table

  // Appointment details
  purpose: string
  description?: string

  // Date and time
  date: string // YYYY-MM-DD
  start_time: string // HH:MM
  end_time: string // HH:MM

  // Notification preferences
  notify_by_email: boolean
  notify_by_sms: boolean
  notify_by_whatsapp?: boolean

  // System fields
  status: "scheduled" | "confirmed" | "completed" | "cancelled" | "no_show"

  // Billing information
  billing_status?: "not_applicable" | "pending" | "processed" | "covered_by_insurance"
  insurance_details?: string
}

// Inventory (Vaccine) table - updated with inventory_id
export interface InventoryItem extends BaseEntity {
  inventory_id: UUID // Primary key
  name: string
  vaccine_type_id: UUID // Foreign key to vaccine_types table
  manufacturer_id: UUID // Foreign key to manufacturers table

  // Batch information
  batch_number: string
  expiry_date: string // YYYY-MM-DD

  // Stock information
  current_stock: number
  initial_stock: number
  min_stock_level: number

  // Storage information
  storage_conditions: string
  storage_location_id: UUID // Foreign key to storage_locations table

  // Supplier information
  supplier_id: UUID // Foreign key to suppliers table

  // Additional information
  notes?: string

  // System fields
  status: "available" | "low_stock" | "out_of_stock" | "expired"
}

// Vaccination Record table
export interface VaccinationRecord extends BaseEntity {
  id: UUID
  patient_id: UUID // Foreign key to patients table
  vaccinator_id: UUID // Foreign key to vaccinators table
  inventory_id: UUID // Foreign key to inventory table
  appointment_id?: UUID // Foreign key to appointments table

  // Vaccination details
  date_administered: string // YYYY-MM-DD
  dose_number?: number
  lot_number: string
  expiration_date: string // YYYY-MM-DD
  site?: string // e.g., "Left Arm"
  route?: string // e.g., "Intramuscular"
  notes?: string

  // Certificate information
  certificate_id?: string
  certificate_url?: string

  // System fields
  status: "valid" | "invalid" | "revoked"
}

// Storage Location table
export interface StorageLocation extends BaseEntity {
  id: UUID
  name: string
  description?: string
  temperature_range?: string
  location_type: "refrigerator" | "freezer" | "ultra_cold_freezer" | "room_temperature"
}

// Supplier table
export interface Supplier extends BaseEntity {
  id: UUID
  name: string
  contact_person?: string
  email?: string
  phone?: string
  address?: string
  notes?: string
}

// Manufacturer table
export interface Manufacturer extends BaseEntity {
  id: UUID
  name: string
  contact_information?: string
  website?: string
}

// Vaccine Type table
export interface VaccineType extends BaseEntity {
  id: UUID
  name: string
  description?: string
  recommended_doses?: number
  dose_interval_days?: number
  target_disease: string
}
