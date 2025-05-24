"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Client-side only authentication check
    const checkAuth = () => {
      if (typeof window === "undefined") return

      try {
        const authUser = localStorage.getItem("authUser")
        if (!authUser) {
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
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/staff-signin")
      } finally {
        setIsLoading(false)
      }
    }

    // Delay to ensure client-side rendering
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
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Doctors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+2 new this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
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
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">COVID-19</span>
                <span className="text-sm text-green-600 font-semibold">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: "85%" }}></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">425 doses available</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Influenza</span>
                <span className="text-sm text-yellow-600 font-semibold">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "45%" }}></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">180 doses available</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Hepatitis B</span>
                <span className="text-sm text-red-600 font-semibold">15%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: "15%" }}></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">30 doses available</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">MMR</span>
                <span className="text-sm text-green-600 font-semibold">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: "92%" }}></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">368 doses available</p>
            </div>
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
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">New patient registered</p>
                  <p className="text-sm text-muted-foreground">John Doe - Patient ID: P001247</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">2 hours ago</span>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Vaccine administered</p>
                  <p className="text-sm text-muted-foreground">COVID-19 booster - Dr. Smith</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">3 hours ago</span>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Stock updated</p>
                  <p className="text-sm text-muted-foreground">Influenza vaccines restocked</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">5 hours ago</span>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Low stock alert</p>
                  <p className="text-sm text-muted-foreground">Hepatitis B vaccines below threshold</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">6 hours ago</span>
            </div>
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
