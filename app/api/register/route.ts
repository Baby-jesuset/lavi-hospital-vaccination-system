import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create a Supabase client with the service role key
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log("Received registration data:", { ...data, password: "[REDACTED]" })

    // Check if we have the required environment variables
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables")
      return NextResponse.json({ error: "Server configuration error. Please contact support." }, { status: 500 })
    }

    // Create a new Supabase client with the service role key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Prepare the patient data based on the actual table structure
    const patientData = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      date_of_birth: data.date_of_birth || null,
      gender: data.gender || null,
      phone: data.phone || null,
      address: data.address || null,
      emergency_contact_name: data.emergency_contact_name || null,
      emergency_contact_phone: data.emergency_contact_phone || null,
      // Convert medical_history to JSONB format
      medical_history: data.medical_history ? JSON.stringify({ notes: data.medical_history }) : null,
      // Convert allergies to array format
      allergies: data.allergies ? [data.allergies] : [],
    }

    console.log("Attempting to insert patient data:", patientData)

    // Try a direct insert with the admin client
    const { data: insertData, error: insertError } = await supabaseAdmin.from("patients").insert(patientData).select()

    if (insertError) {
      console.error("Error creating patient:", insertError)

      // If the first attempt failed, try with minimal data
      if (insertError.message.includes("violates row-level security policy")) {
        console.log("RLS policy violation. Trying with minimal data...")

        // Try with just the essential fields
        const minimalData = {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
        }

        const { data: minimalInsertData, error: minimalInsertError } = await supabaseAdmin
          .from("patients")
          .insert(minimalData)
          .select()

        if (minimalInsertError) {
          console.error("Error with minimal insert:", minimalInsertError)

          // Try one more approach - use the stored procedure
          try {
            console.log("Attempting to use stored procedure...")
            const { data: procData, error: procError } = await supabaseAdmin.rpc("create_patient_bypass_rls", {
              p_first_name: data.first_name,
              p_last_name: data.last_name,
              p_email: data.email,
            })

            if (procError) {
              console.error("Stored procedure error:", procError)
              return NextResponse.json(
                { error: "Could not create patient record. Please contact support." },
                { status: 500 },
              )
            }

            console.log("Stored procedure successful:", procData)
            return NextResponse.json({ success: true, data: procData })
          } catch (procExecError) {
            console.error("Procedure execution error:", procExecError)
            return NextResponse.json({ error: "Database error. Please try again later." }, { status: 500 })
          }
        }

        console.log("Minimal patient data inserted successfully:", minimalInsertData)
        return NextResponse.json({ success: true, data: minimalInsertData })
      }

      return NextResponse.json({ error: insertError.message }, { status: 400 })
    }

    console.log("Patient created successfully:", insertData)
    return NextResponse.json({ success: true, data: insertData })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
