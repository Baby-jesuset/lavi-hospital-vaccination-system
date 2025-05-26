import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create a Supabase client with service role key to bypass RLS
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function GET(request: Request) {
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
    })

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    let query = supabaseAdmin.from("vaccine_inventory").select("*")

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    const result = await query.order("created_at", { ascending: false })

    if (result.error) {
      console.error("Error fetching inventory:", result.error)
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    return NextResponse.json({ data: result.data || [] })
  } catch (error: any) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
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
    })

    const requestData = await request.json()

    // Extract fields individually instead of using destructuring
    const vaccine_name = requestData.vaccine_name
    const manufacturer = requestData.manufacturer
    const batch_number = requestData.batch_number
    const expiration_date = requestData.expiration_date
    const total_doses = requestData.total_doses
    const available_doses = requestData.available_doses
    const storage_location = requestData.storage_location
    const storage_requirements = requestData.storage_requirements
    const status = requestData.status

    // Prepare the vaccine data for insertion
    const vaccineData = {
      vaccine_name,
      manufacturer,
      batch_number,
      expiration_date,
      total_doses,
      available_doses,
      storage_location,
      storage_requirements,
      status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const result = await supabaseAdmin.from("vaccine_inventory").insert([vaccineData]).select().single()

    if (result.error) {
      console.error("Error inserting vaccine:", result.error)
      return NextResponse.json({ error: result.error.message }, { status: 400 })
    }

    return NextResponse.json({ data: result.data })
  } catch (error: any) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
