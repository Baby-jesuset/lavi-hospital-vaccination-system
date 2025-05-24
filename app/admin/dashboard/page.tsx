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
    // Check if user is authenticated as admin
    const checkAdminAuth = () => {
      try {
        // Simple client-side check - in production, this should be more secure
        const userRole = localStorage.getItem("userRole")
        if (userRole !== "admin") {
          throw new Error("Not authorized")
        }

        setIsAuthorized(true)
        setIsLoading(false)
      } catch (error) {
        console.error("Authentication error:", error)
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You are not authorized to view this page.",
        })
        router.push("/staff-signin")
      }
    }

    // Add a small delay to ensure client-side code runs properly
    const timer = setTimeout(() => {
      checkAdminAuth()
    }, 100)

    return () => clearTimeout(timer)
  }, [router, toast])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link href="/admin/reports">
          <Button>View Detailed Reports</Button>
        </Link>
      </div>

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
            <CardTitle className="text-sm font-medium">Doctors Registered</CardTitle>
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
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground text-red-600">Low stock items</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vaccine Stock Levels</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-4 border rounded">
                <div className="font-medium">COVID-19</div>
                <div className="text-2xl font-bold text-green-600">85%</div>
              </div>
              <div className="p-4 border rounded">
                <div className="font-medium">Influenza</div>
                <div className="text-2xl font-bold text-yellow-600">45%</div>
              </div>
              <div className="p-4 border rounded">
                <div className="font-medium">Hepatitis B</div>
                <div className="text-2xl font-bold text-red-600">15%</div>
              </div>
              <div className="p-4 border rounded">
                <div className="font-medium">MMR</div>
                <div className="text-2xl font-bold text-green-600">92%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <p className="text-sm text-muted-foreground">Latest system activities</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-medium">New patient registered</p>
                <p className="text-sm text-muted-foreground">John Doe - 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-medium">Vaccine administered</p>
                <p className="text-sm text-muted-foreground">COVID-19 booster - 3 hours ago</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-medium">Stock updated</p>
                <p className="text-sm text-muted-foreground">Influenza vaccines - 5 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
