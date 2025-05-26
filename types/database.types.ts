export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      appointments: {
        Row: {
          id: string
          patient_id: string
          vaccinator_id: string
          vaccine_id: string | null
          appointment_date: string
          appointment_time: string
          status: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          vaccinator_id: string
          vaccine_id?: string | null
          appointment_date: string
          appointment_time: string
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          vaccinator_id?: string
          vaccine_id?: string | null
          appointment_date?: string
          appointment_time?: string
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
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
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          id: string
          vaccine_type_id: string
          manufacturer_id: string
          supplier_id: string | null
          storage_location_id: string | null
          lot_number: string
          expiration_date: string
          quantity_available: number
          quantity_reserved: number
          status: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vaccine_type_id: string
          manufacturer_id: string
          supplier_id?: string | null
          storage_location_id?: string | null
          lot_number: string
          expiration_date: string
          quantity_available: number
          quantity_reserved?: number
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vaccine_type_id?: string
          manufacturer_id?: string
          supplier_id?: string | null
          storage_location_id?: string | null
          lot_number?: string
          expiration_date?: string
          quantity_available?: number
          quantity_reserved?: number
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
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
          name: string
          contact_information: string | null
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          contact_information?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          contact_information?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      patients: {
        Row: {
          id: string
          auth_id: string | null
          first_name: string
          last_name: string
          date_of_birth: string
          gender: string | null
          email: string
          phone: string | null
          address: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          medical_history: string | null
          allergies: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_id?: string | null
          first_name: string
          last_name: string
          date_of_birth: string
          gender?: string | null
          email: string
          phone?: string | null
          address?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          medical_history?: string | null
          allergies?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_id?: string | null
          first_name?: string
          last_name?: string
          date_of_birth?: string
          gender?: string | null
          email?: string
          phone?: string | null
          address?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          medical_history?: string | null
          allergies?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      storage_locations: {
        Row: {
          id: string
          name: string
          description: string | null
          temperature_range: string | null
          location_type: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          temperature_range?: string | null
          location_type: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          temperature_range?: string | null
          location_type?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          id: string
          name: string
          contact_person: string | null
          email: string | null
          phone: string | null
          address: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      vaccination_records: {
        Row: {
          id: string
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
          certificate_url: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
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
          certificate_url?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
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
          certificate_url?: string | null
          status?: string
          created_at?: string
          updated_at?: string
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
          auth_id: string | null
          first_name: string
          last_name: string
          email: string
          phone: string | null
          license_number: string
          department_id: string | null
          role: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_id?: string | null
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          license_number: string
          department_id?: string | null
          role?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_id?: string | null
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          license_number?: string
          department_id?: string | null
          role?: string | null
          status?: string
          created_at?: string
          updated_at?: string
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
          name: string
          description: string | null
          recommended_doses: number | null
          dose_interval_days: number | null
          target_disease: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          recommended_doses?: number | null
          dose_interval_days?: number | null
          target_disease: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          recommended_doses?: number | null
          dose_interval_days?: number | null
          target_disease?: string
          created_at?: string
          updated_at?: string
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
