"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, Download } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

// Force dynamic rendering to prevent prerender errors
export const dynamic = "force-dynamic"

export default function VaccinationRecords() {
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate data fetching
    const fetchVaccinationRecords = async () => {
      try {
        // This will be replaced with actual Supabase queries
        // const { data, error } = await supabase
        //   .from('vaccination_records')
        //   .select('*, inventory_items(*), vaccinators(*)')
        //   .eq('patient_id', currentUser.id);

        // if (error) throw error;

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // setVaccinationRecords(data);
      } catch (error) {
        console.error("Error fetching vaccination records:", error)
        toast({
          title: "Error",
          description: "Failed to load your vaccination records. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchVaccinationRecords()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/patient/dashboard">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Vaccination Records</h1>
            <p className="text-muted-foreground mt-2">View and download your vaccination history</p>
          </div>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download Records
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Records</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Vaccination History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Vaccine</TableHead>
                    <TableHead>Administered By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Certificate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    // Skeleton loading state
                    Array(3)
                      .fill(0)
                      .map((_, index) => (
                        <TableRow key={`skeleton-${index}`}>
                          <TableCell>
                            <Skeleton className="h-4 w-[100px]" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-[150px]" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-[120px]" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-6 w-[80px] rounded-full" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-9 w-[100px]" />
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        No vaccination records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Vaccinations</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-6">No upcoming vaccinations scheduled</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates">
          <Card>
            <CardHeader>
              <CardTitle>Vaccination Certificates</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-6">No certificates available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Immunization Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-3/4" />
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-6">No immunization schedule available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vaccination Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-3/4" />
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-6">No vaccination requirements to display</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
