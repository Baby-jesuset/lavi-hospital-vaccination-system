"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

// Force dynamic rendering to bypass prerender issues
export const dynamic = "force-dynamic"

// Define types locally
interface DashboardStats {
  totalVaccines: number
  activeDoctors: number
  upcomingAppointments: number
  stockAlerts: number
}

interface StockLevel {
  name: string
  percentage: number
  available: number
  color: string
}

interface Activity {
  id: string
  type: string
  description: string
  timestamp: string
  color: string
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [stats, setStats] = useState<DashboardStats>({
    totalVaccines: 1247,
    activeDoctors: 24,
    upcomingAppointments: 156,
    stockAlerts: 3,
  })
  const [stockLevels, setStockLevels] = useState<StockLevel[]>([
    { name: "COVID-19", percentage: 85, available: 425, color: "green" },
    { name: "Influenza", percentage: 45, available: 180, color: "yellow" },
    { name: "Hepatitis B", percentage: 15, available: 30, color: "red" },
    { name: "MMR", percentage: 92, available: 368, color: "green" },
  ])
  const [activities, setActivities] = useState<Activity[]>([
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
  ])

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === "undefined") return

      try {
        const authUser = localStorage.getItem("authUser")
        if (!authUser) {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You are not authorized to view this page.",
          })
          router.push("/staff-signin")
          return
        }

        const user = JSON.parse(authUser)
        if (user.role !== "admin" || user.email !== "admin@lavihospital.com") {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You are not authorized to view this page.",
          })
          router.push("/staff-signin")
          return
        }

        setIsAuthorized(true)
        setIsLoading(false)
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/staff-signin")
      }
    }

    const timer = setTimeout(checkAuth, 100)
    return () => clearTimeout(timer)
  }, [router, toast])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Redirecting...</h2>
          <p className="text-muted-foreground">Please wait while we verify your credentials.</p>
        </div>
      </div>
    )
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
            <div className="text-2xl font-bold">{stats.totalVaccines.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Doctors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeDoctors}</div>
            <p className="text-xs text-muted-foreground">+2 new this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingAppointments}</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.stockAlerts}</div>
            <p className="text-xs text-muted-foreground">Low stock items</p>
          </CardContent>
        </Card>
      </div>

      {/* Vaccine Stock Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Vaccine Stock Levels</CardTitle>
          <p className="text-sm text-muted-foreground">Current inventory status</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stockLevels.map((stock) => (
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
          <p className="text-sm text-muted-foreground">Latest updates and actions</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.color === "green"
                        ? "bg-green-500"
                        : activity.color === "blue"
                          ? "bg-blue-500"
                          : activity.color === "yellow"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                    }`}
                  ></div>
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <p className="text-sm text-muted-foreground">Common administrative tasks</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/inventory-management">
              <Button variant="outline" className="w-full h-20 flex flex-col">
                <span className="font-medium">Manage Inventory</span>
                <span className="text-xs text-muted-foreground">Update stock levels</span>
              </Button>
            </Link>

            <Link href="/admin/vaccinator-management">
              <Button variant="outline" className="w-full h-20 flex flex-col">
                <span className="font-medium">Manage Staff</span>
                <span className="text-xs text-muted-foreground">Add/edit doctors</span>
              </Button>
            </Link>

            <Link href="/admin/patient-oversight">
              <Button variant="outline" className="w-full h-20 flex flex-col">
                <span className="font-medium">Patient Oversight</span>
                <span className="text-xs text-muted-foreground">View all patients</span>
              </Button>
            </Link>

            <Link href="/admin/reports">
              <Button variant="outline" className="w-full h-20 flex flex-col">
                <span className="font-medium">Generate Reports</span>
                <span className="text-xs text-muted-foreground">Analytics & insights</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
