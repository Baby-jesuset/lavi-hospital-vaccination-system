import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerClient()

    // Get total vaccines administered
    const { data: vaccinations, error: vaccinationError } = await supabase.from("vaccination_records").select("id")

    // Get active doctors count
    const { data: doctors, error: doctorError } = await supabase
      .from("staff")
      .select("id")
      .eq("role", "doctor")
      .eq("status", "active")

    // Get upcoming appointments (next 7 days)
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)

    const { data: appointments, error: appointmentError } = await supabase
      .from("appointments")
      .select("id")
      .gte("appointment_date", new Date().toISOString())
      .lte("appointment_date", nextWeek.toISOString())

    // Get stock alerts (vaccines with quantity < 50)
    const { data: lowStock, error: stockError } = await supabase.from("inventory").select("id").lt("quantity", 50)

    // Get stock levels
    const { data: inventory, error: inventoryError } = await supabase.from("inventory").select("vaccine_name, quantity")

    // Calculate stock levels with percentages (assuming max capacity of 500 per vaccine)
    const stockLevels =
      inventory?.map((item) => {
        const percentage = Math.min((item.quantity / 500) * 100, 100)
        let color = "green"
        if (percentage < 30) color = "red"
        else if (percentage < 60) color = "yellow"

        return {
          name: item.vaccine_name,
          percentage: Math.round(percentage),
          available: item.quantity,
          color,
        }
      }) || []

    // Get recent activities (last 10 vaccination records)
    const { data: recentVaccinations, error: recentError } = await supabase
      .from("vaccination_records")
      .select(`
        id,
        created_at,
        vaccine_name,
        patients(first_name, last_name),
        staff(first_name, last_name)
      `)
      .order("created_at", { ascending: false })
      .limit(10)

    const activities =
      recentVaccinations?.map((record, index) => ({
        id: record.id.toString(),
        type: "Vaccine administered",
        description: `${record.vaccine_name} - ${record.patients?.first_name} ${record.patients?.last_name} by Dr. ${record.staff?.first_name} ${record.staff?.last_name}`,
        timestamp: new Date(record.created_at).toLocaleString(),
        color: "blue",
      })) || []

    const stats = {
      totalVaccines: vaccinations?.length || 0,
      activeDoctors: doctors?.length || 0,
      upcomingAppointments: appointments?.length || 0,
      stockAlerts: lowStock?.length || 0,
      stockLevels,
      recentActivities: activities,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json(
      {
        totalVaccines: 0,
        activeDoctors: 0,
        upcomingAppointments: 0,
        stockAlerts: 0,
        stockLevels: [],
        recentActivities: [],
      },
      { status: 500 },
    )
  }
}
