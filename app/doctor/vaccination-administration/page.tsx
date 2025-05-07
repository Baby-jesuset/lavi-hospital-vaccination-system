"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Search, Syringe } from "lucide-react"
import Link from "next/link"

export default function VaccinationAdministration() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/doctor/dashboard">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Vaccination Administration</h1>
            <p className="text-muted-foreground mt-2">Manage and record vaccinations</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="new" className="space-y-6">
        <TabsList>
          <TabsTrigger value="new">New Vaccination</TabsTrigger>
          <TabsTrigger value="history">Vaccination History</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Label htmlFor="patientSearch">Search Patient</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="patientSearch"
                      placeholder="Enter patient name or ID"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button className="mt-8">Search</Button>
              </div>
              <p className="text-center text-muted-foreground py-4">No patient selected</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vaccination Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="vaccine">Select Vaccine</Label>
                  <Select disabled>
                    <SelectTrigger id="vaccine">
                      <SelectValue placeholder="Choose vaccine type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flu">Influenza</SelectItem>
                      <SelectItem value="covid">COVID-19</SelectItem>
                      <SelectItem value="tdap">Tdap</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="batch">Batch Number</Label>
                  <Input id="batch" placeholder="Enter batch number" disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input id="notes" placeholder="Add any relevant notes" disabled />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button variant="outline" disabled>
                  Cancel
                </Button>
                <Button disabled>
                  <Syringe className="mr-2 h-4 w-4" />
                  Record Vaccination
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recent Vaccinations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-6">No vaccination history to display</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
