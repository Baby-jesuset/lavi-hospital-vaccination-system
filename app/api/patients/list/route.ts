import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerClient()

    // Updated to use patient_id instead of id
    const { data, error } = await supabase
      .from("patients")
      .select("patient_id, first_name, last_name, email")
      .order("last_name", { ascending: true })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: `Failed to fetch patients: ${error.message}` }, { status: 500 })
    }

    // Map patient_id to id for frontend compatibility
    const formattedData =
      data?.map((patient) => ({
        id: patient.patient_id,
        first_name: patient.first_name,
        last_name: patient.last_name,
        email: patient.email,
      })) || []

    return NextResponse.json({ data: formattedData })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
