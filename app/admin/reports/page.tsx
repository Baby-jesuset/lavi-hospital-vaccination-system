"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range"
import { ChevronLeft, Download, Loader2, TrendingUp, Package, Calendar } from "lucide-react"
import Link from "next/link"

// Force dynamic rendering to prevent prerender errors
export const dynamic = "force-dynamic"

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState("vaccination")
  const [isLoading, setIsLoading] = useState(false)
  const [dateRange, setDateRange] = useState({ from: new Date(2023, 0, 1), to: new Date() })

  const generatePDF = () => {
    setIsLoading(true)
    // Simulate PDF generation
    setTimeout(() => {
      setIsLoading(false)
      console.log("Generating PDF...")
    }, 2000)
  }

  // Sample data for different report types
  const getReportData = () => {
    switch (selectedReport) {
      case "vaccination":
        return {
          title: "Vaccination Trends",
          description: "Monthly vaccination statistics and trends",
          data: [
            { month: "January", vaccinations: 245, target: 300 },
            { month: "February", vaccinations: 312, target: 300 },
            { month: "March", vaccinations: 289, target: 300 },
            { month: "April", vaccinations: 356, target: 300 },
            { month: "May", vaccinations: 423, target: 400 },
          ],
        }
      case "stock":
        return {
          title: "Stock Usage",
          description: "Vaccine inventory usage and consumption patterns",
          data: [
            { vaccine: "COVID-19 mRNA", used: 450, remaining: 150, reorderLevel: 100 },
            { vaccine: "Influenza", used: 230, remaining: 270, reorderLevel: 200 },
            { vaccine: "Hepatitis B", used: 89, remaining: 411, reorderLevel: 150 },
            { vaccine: "MMR", used: 156, remaining: 344, reorderLevel: 200 },
          ],
        }
      case "appointments":
        return {
          title: "Missed Appointments",
          description: "Analysis of missed appointments and follow-up actions",
          data: [
            { week: "Week 1", scheduled: 120, attended: 98, missed: 22, missedRate: "18%" },
            { week: "Week 2", scheduled: 135, attended: 115, missed: 20, missedRate: "15%" },
            { week: "Week 3", scheduled: 142, attended: 128, missed: 14, missedRate: "10%" },
            { week: "Week 4", scheduled: 156, attended: 139, missed: 17, missedRate: "11%" },
          ],
        }
      default:
        return { title: "Report", description: "No data available", data: [] }
    }
  }

  const reportData = getReportData()

  const getReportIcon = () => {
    switch (selectedReport) {
      case "vaccination":
        return <TrendingUp className="h-5 w-5" />
      case "stock":
        return <Package className="h-5 w-5" />
      case "appointments":
        return <Calendar className="h-5 w-5" />
      default:
        return <TrendingUp className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
        </div>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <Select onValueChange={setSelectedReport} defaultValue={selectedReport}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select report" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vaccination">Vaccination Trends</SelectItem>
            <SelectItem value="stock">Stock Usage</SelectItem>
            <SelectItem value="appointments">Missed Appointments</SelectItem>
          </SelectContent>
        </Select>
        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        <Button onClick={generatePDF} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getReportIcon()}
            {reportData.title}
          </CardTitle>
          <CardDescription>{reportData.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {reportData.data.length > 0 ? (
            <div className="space-y-4">
              {selectedReport === "vaccination" && (
                <div className="grid gap-4">
                  {reportData.data.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.month}</p>
                        <p className="text-sm text-muted-foreground">Target: {item.target}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{item.vaccinations}</p>
                        <p
                          className={`text-sm ${item.vaccinations >= item.target ? "text-green-600" : "text-orange-600"}`}
                        >
                          {item.vaccinations >= item.target ? "Target Met" : "Below Target"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedReport === "stock" && (
                <div className="grid gap-4">
                  {reportData.data.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.vaccine}</p>
                        <p className="text-sm text-muted-foreground">Reorder Level: {item.reorderLevel}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">Used: {item.used}</p>
                        <p
                          className={`text-sm ${item.remaining <= item.reorderLevel ? "text-red-600" : "text-green-600"}`}
                        >
                          Remaining: {item.remaining}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedReport === "appointments" && (
                <div className="grid gap-4">
                  {reportData.data.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.week}</p>
                        <p className="text-sm text-muted-foreground">Scheduled: {item.scheduled}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">Attended: {item.attended}</p>
                        <p className="text-sm text-red-600">
                          Missed: {item.missed} ({item.missedRate})
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-[350px] flex items-center justify-center">
              <p className="text-muted-foreground">No data to display</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
