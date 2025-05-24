"use server"

import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock data for dashboard stats
    // In production, this would query your database
    const stats = {
      totalVaccines: 1247,
      activeDoctors: 24,
      upcomingAppointments: 156,
      stockAlerts: 3,
      stockLevels: [
        { name: "COVID-19", percentage: 85, available: 425, color: "green" },
        { name: "Influenza", percentage: 45, available: 180, color: "yellow" },
        { name: "Hepatitis B", percentage: 15, available: 30, color: "red" },
        { name: "MMR", percentage: 92, available: 368, color: "green" },
      ],
      recentActivities: [
        {
          id: "1",
          type: "New patient registered",
          description: "John Doe - Patient ID: P001247",
          timestamp: "2 hours ago",
          color: "green",
        },
        {
          id: "2",
          type: "Vaccine administered",
          description: "COVID-19 booster - Dr. Smith",
          timestamp: "3 hours ago",
          color: "blue",
        },
        {
          id: "3",
          type: "Stock updated",
          description: "Influenza vaccines restocked",
          timestamp: "5 hours ago",
          color: "yellow",
        },
        {
          id: "4",
          type: "Low stock alert",
          description: "Hepatitis B vaccines below threshold",
          timestamp: "6 hours ago",
          color: "red",
        },
      ],
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard statistics" }, { status: 500 })
  }
}
