"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"

// Mock data for patient records
const patientRecords = [
  { id: 1, name: "Alice Johnson", dob: "1990-05-15", lastVisit: "2023-06-10" },
  { id: 2, name: "Bob Smith", dob: "1985-11-22", lastVisit: "2023-06-05" },
  { id: 3, name: "Carol Williams", dob: "1978-03-30", lastVisit: "2023-06-01" },
]

export default function PatientRecords() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<(typeof patientRecords)[0] | null>(null)

  const filteredPatients = patientRecords.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Patient Records</h1>

      <div className="flex items-center space-x-2">
        <Search className="w-5 h-5 text-gray-500" />
        <Input
          type="search"
          placeholder="Search patients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date of Birth</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.dob}</TableCell>
                  <TableCell>{patient.lastVisit}</TableCell>
                  <TableCell>
                    <Button variant="outline" onClick={() => setSelectedPatient(patient)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedPatient && (
        <Card>
          <CardHeader>
            <CardTitle>Patient Details: {selectedPatient.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="info" className="space-y-4">
              <TabsList>
                <TabsTrigger value="info">Personal Info</TabsTrigger>
                <TabsTrigger value="medical-history">Medical History</TabsTrigger>
                <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
              </TabsList>

              <TabsContent value="info">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Full Name</Label>
                    <Input value={selectedPatient.name} readOnly />
                  </div>
                  <div className="grid gap-2">
                    <Label>Date of Birth</Label>
                    <Input value={selectedPatient.dob} readOnly />
                  </div>
                  <div className="grid gap-2">
                    <Label>Last Visit</Label>
                    <Input value={selectedPatient.lastVisit} readOnly />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="medical-history">
                <p className="text-sm text-muted-foreground">Medical history will be displayed here.</p>
                {/* Add medical history information here */}
              </TabsContent>

              <TabsContent value="vaccinations">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vaccine</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>COVID-19</TableCell>
                      <TableCell>2023-01-15</TableCell>
                      <TableCell>
                        <Badge>Completed</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Flu Shot</TableCell>
                      <TableCell>2022-10-01</TableCell>
                      <TableCell>
                        <Badge>Completed</Badge>
                      </TableCell>
                    </TableRow>
                    {/* Add more vaccination records as needed */}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

