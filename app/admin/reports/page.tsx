"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range"
import { ChevronLeft, Download, Loader2 } from "lucide-react"
import Link from "next/link"

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
          <CardTitle>
            {selectedReport === "vaccination"
              ? "Vaccination Trends"
              : selectedReport === "stock"
                ? "Stock Usage"
                : "Missed Appointments"}
          </CardTitle>
          <CardDescription>No data available for the selected report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] flex items-center justify-center">
            <p>No data to display</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
