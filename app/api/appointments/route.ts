import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const searchParams = request.nextUrl.searchParams

    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const patientId = searchParams.get("patientId") // Optional filter for patient-specific appointments

    if (!startDate || !endDate) {
      return NextResponse.json({ error: "startDate and endDate are required" }, { status: 400 })
    }

    // Validate patientId format if provided
    if (patientId) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      if (!uuidRegex.test(patientId)) {
        return NextResponse.json({ error: "Invalid patient ID format. Must be a valid UUID." }, { status: 400 })
      }
    }

    // Build the query
    let query = supabase
      .from("appointments")
      .select("*")
      .gte("date_of_visit", startDate)
      .lte("date_of_visit", endDate)
      .order("date_of_visit", { ascending: true })
      .order("start_time", { ascending: true })

    // Add patient filter if provided (for patient-specific requests)
    if (patientId) {
      query = query.eq("patient_id", patientId)
    }

    const { data: appointments, error: appointmentsError } = await query

    if (appointmentsError) {
      console.error("Database error fetching appointments:", appointmentsError)
      return NextResponse.json({ error: `Failed to fetch appointments: ${appointmentsError.message}` }, { status: 500 })
    }

    // If we have appointments, fetch the related patients and vaccinators
    if (appointments && appointments.length > 0) {
      // Get unique patient IDs and vaccinator IDs
      const patientIds = [...new Set(appointments.map((a) => a.patient_id))]
      const vaccinatorIds = [...new Set(appointments.map((a) => a.vaccinator_id))]

      // Fetch patients
      const { data: patients, error: patientsError } = await supabase
        .from("patients")
        .select("patient_id, first_name, last_name, email")
        .in("patient_id", patientIds)

      if (patientsError) {
        console.error("Database error fetching patients:", patientsError)
        return NextResponse.json({ error: `Failed to fetch patients: ${patientsError.message}` }, { status: 500 })
      }

      // Fetch vaccinators
      const { data: vaccinators, error: vaccinatorsError } = await supabase
        .from("vaccinators")
        .select("vaccinator_id, first_name, last_name, email")
        .in("vaccinator_id", vaccinatorIds)

      if (vaccinatorsError) {
        console.error("Database error fetching vaccinators:", vaccinatorsError)
        return NextResponse.json({ error: `Failed to fetch vaccinators: ${vaccinatorsError.message}` }, { status: 500 })
      }

      // Create a map for quick lookups
      const patientsMap =
        patients?.reduce((map, patient) => {
          map[patient.patient_id] = patient
          return map
        }, {}) || {}

      const vaccinatorsMap =
        vaccinators?.reduce((map, vaccinator) => {
          map[vaccinator.vaccinator_id] = vaccinator
          return map
        }, {}) || {}

      // Combine the data
      const formattedData = appointments.map((appointment) => ({
        ...appointment,
        patients: patientsMap[appointment.patient_id] || null,
        vaccinators: vaccinatorsMap[appointment.vaccinator_id] || null,
      }))

      return NextResponse.json({ data: formattedData })
    }

    // If no appointments, return empty array
    return NextResponse.json({ data: [] })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const appointmentData = await request.json()

    // Validate required fields
    const requiredFields = [
      "patient_id",
      "vaccinator_id",
      "purpose",
      "date_of_visit",
      "start_time",
      "end_time",
      "status",
    ]

    for (const field of requiredFields) {
      if (!appointmentData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // First, check if the patient exists in the database
    const { data: patientExists, error: patientCheckError } = await supabase
      .from("patients")
      .select("patient_id")
      .eq("patient_id", appointmentData.patient_id)
      .single()

    if (patientCheckError || !patientExists) {
      console.error("Patient does not exist:", patientCheckError)
      return NextResponse.json(
        {
          error: "Patient record not found. Please ensure you are registered in the system.",
        },
        { status: 400 },
      )
    }

    // Now insert the appointment
    const { data, error } = await supabase.from("appointments").insert(appointmentData).select()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: `Failed to create appointment: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ data: data[0] || null })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
