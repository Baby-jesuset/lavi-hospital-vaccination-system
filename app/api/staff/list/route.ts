import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase Admin client with service role key
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function GET() {
  try {
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
      global: {
        headers: {
          Accept: "application/json",
        },
      },
    })

    // Query the vaccinators table instead of staff
    const result = await supabaseAdmin.from("vaccinators").select("*").order("created_at", { ascending: false })

    if (result.error) {
      console.error("Error fetching vaccinators:", result.error)
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    // Map the data to maintain compatibility with the frontend
    const mappedData =
      result.data?.map((vaccinator) => ({
        ...vaccinator,
        id: vaccinator.vaccinator_id, // Map vaccinator_id to id for frontend compatibility
      })) || []

    return NextResponse.json({ data: mappedData })
  } catch (error: any) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
