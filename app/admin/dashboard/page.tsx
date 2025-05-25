"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

// Force dynamic rendering to bypass prerender issues
export const dynamic = "force-dynamic"

interface DashboardData {
  totalVaccines: number
  activeDoctors: number
  upcomingAppointments: number
  stockAlerts: number
  stockLevels: Array<{
    name: string
    percentage: number
    available: number
    color: string
  }>
  recentActivities: Array<{
    id: string
    type: string
    description: string
    timestamp: string
    color: string
  }>
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [data, setData] = useState<DashboardData>({
    totalVaccines: 0,
    activeDoctors: 0,
    upcomingAppointments: 0,
    stockAlerts: 0,
    stockLevels: [],
    recentActivities: [],
  })

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      if (typeof window === "undefined") return

      try {
        const authUser = localStorage.getItem("authUser")
        if (!authUser) {
          router.push("/staff-signin")
          return
        }

        const user = JSON.parse(authUser)
        if (user.role !== "admin" || user.email !== "admin@lavihospital.com") {
          router.push("/staff-signin")
          return
        }

        setIsAuthorized(true)

        // Fetch dashboard data
        const response = await fetch("/api/dashboard/stats")
        if (response.ok) {
          const dashboardData = await response.json()
          setData(dashboardData)
        }
      } catch (error) {
        console.error("Error:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load dashboard data",
        })
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndLoadData()
  }, [router, toast])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link href="/admin/reports">
          <Button>View Detailed Reports</Button>
        </Link>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vaccines Administered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalVaccines.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Doctors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeDoctors}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.upcomingAppointments}</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{data.stockAlerts}</div>
            <p className="text-xs text-muted-foreground">Low stock items</p>
          </CardContent>
        </Card>
      </div>

      {/* Vaccine Stock Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Vaccine Stock Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.stockLevels.map((stock) => (
              <div key={stock.name} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{stock.name}</span>
                  <span
                    className={`text-sm font-semibold ${
                      stock.color === "green"
                        ? "text-green-600"
                        : stock.color === "yellow"
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  >
                    {stock.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      stock.color === "green"
                        ? "bg-green-600"
                        : stock.color === "yellow"
                          ? "bg-yellow-600"
                          : "bg-red-600"
                    }`}
                    style={{ width: `${stock.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stock.available} doses available</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent System Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <div>
                    <p className="font-medium">{activity.type}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
