import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function executeQuery<T>(queryFn: (supabase: any) => Promise<any>): Promise<NextResponse> {
  try {
    const supabase = createServerClient()

    // Execute the query function
    const { data, error } = await queryFn(supabase)

    // Handle database errors
    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 400 })
    }

    // Return successful response
    return NextResponse.json({ data })
  } catch (error: any) {
    // Handle unexpected errors
    console.error("Server error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
