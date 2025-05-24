import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerClient()

    // For demo purposes, we'll fetch the first patient from the database
    // In a real app, you would get the current user from the session
    const { data, error } = await supabase.from("patients").select("*").limit(1)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data || data.length === 0) {
      // Create a sample patient if none exists
      const { data: newPatient, error: createError } = await supabase
        .from("patients")
        .insert([
          {
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@example.com",
            phone: "1234567890",
            date_of_birth: "1990-01-01",
            address: "123 Main St",
            city: "Anytown",
            state: "CA",
            zip_code: "12345",
            gender: "male",
            emergency_contact_name: "Jane Doe",
            emergency_contact_phone: "0987654321",
          },
        ])
        .select()

      if (createError) {
        console.error("Error creating sample patient:", createError)
        return NextResponse.json({ error: "No patients found and could not create sample" }, { status: 500 })
      }

      return NextResponse.json({ patient: newPatient[0] })
    }

    return NextResponse.json({ patient: data[0] })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
