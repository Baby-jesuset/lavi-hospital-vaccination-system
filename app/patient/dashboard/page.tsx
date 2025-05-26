"use client"
<<<<<<< HEAD
=======

>>>>>>> 595bee3463104cee9216762a786993bc50791b83
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { CalendarDays, Syringe, Bell, Activity } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"

<<<<<<< HEAD
=======
// Force dynamic rendering to prevent prerender errors
export const dynamic = "force-dynamic"

>>>>>>> 595bee3463104cee9216762a786993bc50791b83
export default function PatientDashboard() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate data fetching
    const fetchDashboardData = async () => {
      try {
        // This will be replaced with actual Supabase queries
        // const { data: patientData, error: patientError } = await supabase
        //   .from('patients')
        //   .select('*')
        //   .eq('user_id', currentUser.id)
        //   .single();

        // if (patientError) throw patientError;

        // const { data: appointmentsData, error: appointmentsError } = await supabase
        //   .from('appointments')
        //   .select('*')
        //   .eq('patient_id', patientData.id)
        //   .order('date', { ascending: true });

        // if (appointmentsError) throw appointmentsError;

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // setPatient(patientData);
        // setAppointments(appointmentsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        // toast({
        //   title: "Error",
        //   description: "Failed to load your dashboard data. Please refresh the page.",
        //   variant: "destructive",
        // });
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Patient Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back, John Doe</p>
        </div>
        <Link href="/patient/appointment-scheduling">
          <Button>
            <CalendarDays className="mr-2 h-4 w-4" />
            Schedule Appointment
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">--</div>
                <p className="text-xs text-muted-foreground">No appointment scheduled</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vaccinations Completed</CardTitle>
            <Syringe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">--</div>
                <p className="text-xs text-muted-foreground">No vaccinations recorded</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Vaccinations</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">--</div>
                <p className="text-xs text-muted-foreground">No upcoming vaccinations</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">--</div>
                <p className="text-xs text-muted-foreground">No data available</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vaccination History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {isLoading ? (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-[40px]" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Overall Progress</span>
                    <span className="font-medium">0%</span>
                  </div>
                  <Progress value={0} />
                </div>
                <div className="space-y-4">
                  <p className="text-center text-muted-foreground py-6">No vaccination history available</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
