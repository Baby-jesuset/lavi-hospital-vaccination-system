import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase Admin client with service role key
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST(request: Request) {
  try {
    // Check if we have the required environment variables
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables")
      return NextResponse.json({ error: "Server configuration error. Please contact support." }, { status: 500 })
    }

    // Parse the request body
    const staffData = await request.json()

    // Create a new Supabase client with the service role key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          Accept: "application/json",
        },
      },
    })

    // Create a new auth user
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: staffData.email,
      password: staffData.password,
      email_confirm: true, // Auto-confirm the email
    })

    if (authError) {
      console.error("Error creating auth user:", authError)
      return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    // Prepare the staff data for insertion
    const vaccinatorData = {
      auth_id: authUser.user.id,
      first_name: staffData.first_name,
      last_name: staffData.last_name,
      email: staffData.email,
      phone: staffData.phone,
      department: staffData.department,
      professional_id: staffData.professional_id,
      status: staffData.status,
      weekday_availability: staffData.weekday_availability,
      weekend_availability: staffData.weekend_availability,
      profile_image_url: staffData.profile_image_url,
    }

    // Insert the staff data into the vaccinators table
    const { data: vaccinator, error: vaccinatorError } = await supabaseAdmin
      .from("vaccinators")
      .insert(vaccinatorData)
      .select("*")
      .single()

    if (vaccinatorError) {
      console.error("Error creating vaccinator:", vaccinatorError)

      // Try to clean up the auth user if the staff insertion fails
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id)

      return NextResponse.json({ error: vaccinatorError.message }, { status: 500 })
    }

    return NextResponse.json({ data: vaccinator })
  } catch (error: any) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
