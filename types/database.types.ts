export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      appointments: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          patient_id: string
          vaccinator_id: string
          vaccine_id: string | null
          appointment_date: string
          appointment_time: string
          status: string
          notes: string | null
          location_id: string | null
          purpose: string | null
          description: string | null
          notify_by_email: boolean | null
          notify_by_sms: boolean | null
          notify_by_whatsapp: boolean | null
          billing_status: string | null
          insurance_details: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string | null
          patient_id: string
          vaccinator_id: string
          vaccine_id?: string | null
          appointment_date: string
          appointment_time: string
          status: string
          notes?: string | null
          location_id?: string | null
          purpose?: string | null
          description?: string | null
          notify_by_email?: boolean | null
          notify_by_sms?: boolean | null
          notify_by_whatsapp?: boolean | null
          billing_status?: string | null
          insurance_details?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          patient_id?: string
          vaccinator_id?: string
          vaccine_id?: string | null
          appointment_date?: string
          appointment_time?: string
          status?: string
          notes?: string | null
          location_id?: string | null
          purpose?: string | null
          description?: string | null
          notify_by_email?: boolean | null
          notify_by_sms?: boolean | null
          notify_by_whatsapp?: boolean | null
          billing_status?: string | null
          insurance_details?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_vaccinator_id_fkey"
            columns: ["vaccinator_id"]
            referencedRelation: "vaccinators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_vaccine_id_fkey"
            columns: ["vaccine_id"]
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          name: string
          description: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string | null
          name: string
          description?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          name?: string
          description?: string | null
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          vaccine_type_id: string
          manufacturer_id: string
          supplier_id: string
          storage_location_id: string
          lot_number: string
          expiration_date: string
          quantity_available: number
          quantity_reserved: number
          status: string
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string | null
          vaccine_type_id: string
          manufacturer_id: string
          supplier_id: string
          storage_location_id: string
          lot_number: string
          expiration_date: string
          quantity_available: number
          quantity_reserved: number
          status: string
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          vaccine_type_id?: string
          manufacturer_id?: string
          supplier_id?: string
          storage_location_id?: string
          lot_number?: string
          expiration_date?: string
          quantity_available?: number
          quantity_reserved?: number
          status?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_manufacturer_id_fkey"
            columns: ["manufacturer_id"]
            referencedRelation: "manufacturers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_storage_location_id_fkey"
            columns: ["storage_location_id"]
            referencedRelation: "storage_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_supplier_id_fkey"
            columns: ["supplier_id"]
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_vaccine_type_id_fkey"
            columns: ["vaccine_type_id"]
            referencedRelation: "vaccine_types"
            referencedColumns: ["id"]
          },
        ]
      }
      manufacturers: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          name: string
          contact_information: string | null
          website: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string | null
          name: string
          contact_information?: string | null
          website?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          name?: string
          contact_information?: string | null
          website?: string | null
        }
        Relationships: []
      }
      patients: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          auth_id: string
          first_name: string
          last_name: string
          email: string
          phone: string
          date_of_birth: string
          gender: string | null
          street: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          country: string | null
          medical_history: string | null
          allergies: string | null
          current_medications: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          status: string
          registration_date: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string | null
          auth_id: string
          first_name: string
          last_name: string
          email: string
          phone: string
          date_of_birth: string
          gender?: string | null
          street?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          country?: string | null
          medical_history?: string | null
          allergies?: string | null
          current_medications?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          status: string
          registration_date: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          auth_id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          date_of_birth?: string
          gender?: string | null
          street?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          country?: string | null
          medical_history?: string | null
          allergies?: string | null
          current_medications?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          status?: string
          registration_date?: string
        }
        Relationships: []
      }
      storage_locations: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          name: string
          description: string | null
          temperature_range: string | null
          location_type: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string | null
          name: string
          description?: string | null
          temperature_range?: string | null
          location_type: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          name?: string
          description?: string | null
          temperature_range?: string | null
          location_type?: string
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          name: string
          contact_person: string | null
          email: string | null
          phone: string | null
          address: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string | null
          name: string
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          name?: string
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          notes?: string | null
        }
        Relationships: []
      }
      vaccination_records: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          patient_id: string
          vaccinator_id: string
          inventory_id: string
          appointment_id: string | null
          date_administered: string
          dose_number: number | null
          site: string | null
          route: string | null
          notes: string | null
          certificate_id: string | null
          status: string
          lot_number: string | null
          expiration_date: string | null
          certificate_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string | null
          patient_id: string
          vaccinator_id: string
          inventory_id: string
          appointment_id?: string | null
          date_administered: string
          dose_number?: number | null
          site?: string | null
          route?: string | null
          notes?: string | null
          certificate_id?: string | null
          status: string
          lot_number?: string | null
          expiration_date?: string | null
          certificate_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          patient_id?: string
          vaccinator_id?: string
          inventory_id?: string
          appointment_id?: string | null
          date_administered?: string
          dose_number?: number | null
          site?: string | null
          route?: string | null
          notes?: string | null
          certificate_id?: string | null
          status?: string
          lot_number?: string | null
          expiration_date?: string | null
          certificate_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vaccination_records_appointment_id_fkey"
            columns: ["appointment_id"]
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vaccination_records_inventory_id_fkey"
            columns: ["inventory_id"]
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vaccination_records_patient_id_fkey"
            columns: ["patient_id"]
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vaccination_records_vaccinator_id_fkey"
            columns: ["vaccinator_id"]
            referencedRelation: "vaccinators"
            referencedColumns: ["id"]
          },
        ]
      }
      vaccinators: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          auth_id: string
          first_name: string
          last_name: string
          email: string
          phone: string
          department_id: string
          specialization: string | null
          credentials: string | null
          license_number: string
          status: string
          available_monday: boolean
          available_tuesday: boolean
          available_wednesday: boolean
          available_thursday: boolean
          available_friday: boolean
          available_saturday: boolean
          available_sunday: boolean
          work_hours_start: string | null
          work_hours_end: string | null
          max_daily_appointments: number | null
          role: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string | null
          auth_id: string
          first_name: string
          last_name: string
          email: string
          phone: string
          department_id: string
          specialization?: string | null
          credentials?: string | null
          license_number: string
          status: string
          available_monday: boolean
          available_tuesday: boolean
          available_wednesday: boolean
          available_thursday: boolean
          available_friday: boolean
          available_saturday: boolean
          available_sunday: boolean
          work_hours_start?: string | null
          work_hours_end?: string | null
          max_daily_appointments?: number | null
          role: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          auth_id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          department_id?: string
          specialization?: string | null
          credentials?: string | null
          license_number?: string
          status?: string
          available_monday?: boolean
          available_tuesday?: boolean
          available_wednesday?: boolean
          available_thursday?: boolean
          available_friday?: boolean
          available_saturday?: boolean
          available_sunday?: boolean
          work_hours_start?: string | null
          work_hours_end?: string | null
          max_daily_appointments?: number | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "vaccinators_department_id_fkey"
            columns: ["department_id"]
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      vaccine_types: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          name: string
          description: string | null
          recommended_doses: number | null
          dose_interval_days: number | null
          target_disease: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string | null
          name: string
          description?: string | null
          recommended_doses?: number | null
          dose_interval_days?: number | null
          target_disease: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          name?: string
          description?: string | null
          recommended_doses?: number | null
          dose_interval_days?: number | null
          target_disease?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
