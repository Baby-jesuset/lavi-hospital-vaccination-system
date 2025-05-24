import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerClient()

    // Updated to use vaccinators table and vaccinator_id
    const { data, error } = await supabase
      .from("vaccinators")
      .select("vaccinator_id, first_name, last_name, email")
      .order("last_name", { ascending: true })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: `Failed to fetch vaccinators: ${error.message}` }, { status: 500 })
    }

    // Map vaccinator_id to id for frontend compatibility
    const formattedData =
      data?.map((vaccinator) => ({
        id: vaccinator.vaccinator_id,
        first_name: vaccinator.first_name,
        last_name: vaccinator.last_name,
        email: vaccinator.email,
      })) || []

    return NextResponse.json({ data: formattedData })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
