"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, FileText } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Mock data for patient records
const patientRecords = [
  {
    id: 1,
    name: "Alice Johnson",
    avatar: "/placeholder.svg?height=32&width=32",
    dob: "1990-05-15",
    lastVisit: "2024-02-20",
    status: "Active",
    upcomingAppointment: "2024-02-25",
    vaccinations: [
      { name: "COVID-19", date: "2023-12-15", status: "Completed" },
      { name: "Flu Shot", date: "2023-10-01", status: "Completed" },
    ],
  },
  {
    id: 2,
    name: "Bob Smith",
    avatar: "/placeholder.svg?height=32&width=32",
    dob: "1985-11-22",
    lastVisit: "2024-02-15",
    status: "Active",
    upcomingAppointment: "2024-03-01",
    vaccinations: [
      { name: "COVID-19", date: "2023-12-10", status: "Completed" },
      { name: "Tdap", date: "2023-09-15", status: "Completed" },
    ],
  },
  {
    id: 3,
    name: "Carol Williams",
    avatar: "/placeholder.svg?height=32&width=32",
    dob: "1978-03-30",
    lastVisit: "2024-02-10",
    status: "Inactive",
    upcomingAppointment: null,
    vaccinations: [{ name: "Flu Shot", date: "2023-11-20", status: "Completed" }],
  },
]

export default function PatientRecords() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<(typeof patientRecords)[0] | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const filteredPatients = patientRecords.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Patient Records</h1>
          <p className="text-muted-foreground mt-2">Manage and view patient information</p>
        </div>
        <div className="relative w-full md:w-[300px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Patient List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="overflow-x-auto max-h-[500px] scrollbar-thin">
              <Table className="min-w-[800px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date of Birth</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Visit</TableHead>
                    <TableHead>Next Appointment</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
                            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{patient.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>{patient.dob}</TableCell>
                      <TableCell>
                        <Badge variant={patient.status === "Active" ? "success" : "secondary"}>{patient.status}</Badge>
                      </TableCell>
                      <TableCell>{new Date(patient.lastVisit).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {patient.upcomingAppointment
                          ? new Date(patient.upcomingAppointment).toLocaleDateString()
                          : "No appointment"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedPatient(patient)
                            setIsDetailsOpen(true)
                          }}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredPatients.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        No patients found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
            <DialogDescription>Detailed information about {selectedPatient?.name}</DialogDescription>
          </DialogHeader>

          {selectedPatient && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedPatient.avatar || "/placeholder.svg"} alt={selectedPatient.name} />
                  <AvatarFallback>{selectedPatient.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedPatient.name}</h3>
                  <p className="text-sm text-muted-foreground">Patient ID: #{selectedPatient.id}</p>
                  <p className="text-sm text-muted-foreground">Born: {selectedPatient.dob}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Vaccination History</h4>
                {selectedPatient.vaccinations.length > 0 ? (
                  <div className="space-y-2">
                    {selectedPatient.vaccinations.map((vaccination, index) => (
                      <div key={index} className="flex justify-between items-center p-2 border rounded-md">
                        <div>
                          <div className="font-medium">{vaccination.name}</div>
                          <div className="text-sm text-muted-foreground">{vaccination.date}</div>
                        </div>
                        <Badge variant="success">{vaccination.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No vaccination history available</p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end mt-4">
            <Button onClick={() => setIsDetailsOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
