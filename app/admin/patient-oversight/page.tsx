"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Search, Filter, Eye, Edit } from "lucide-react"
import Link from "next/link"

// Force dynamic rendering to prevent prerender errors
export const dynamic = "force-dynamic"

export default function PatientOversight() {
  const [searchQuery, setSearchQuery] = useState("")

  // Sample patient data for demonstration
  const patients = [
    {
      id: 1,
      name: "John Doe",
      dateOfBirth: "1985-03-15",
      contact: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      lastVaccination: "2024-01-15",
      nextVaccination: "2024-07-15",
      status: "Up to Date",
      vaccinationCount: 3,
    },
    {
      id: 2,
      name: "Jane Smith",
      dateOfBirth: "1990-07-22",
      contact: "jane.smith@email.com",
      phone: "+1 (555) 987-6543",
      lastVaccination: "2023-12-10",
      nextVaccination: "2024-06-10",
      status: "Due Soon",
      vaccinationCount: 2,
    },
    {
      id: 3,
      name: "Robert Johnson",
      dateOfBirth: "1978-11-08",
      contact: "robert.j@email.com",
      phone: "+1 (555) 456-7890",
      lastVaccination: "2023-08-20",
      nextVaccination: "2024-02-20",
      status: "Overdue",
      vaccinationCount: 1,
    },
    {
      id: 4,
      name: "Emily Davis",
      dateOfBirth: "1995-05-12",
      contact: "emily.davis@email.com",
      phone: "+1 (555) 321-0987",
      lastVaccination: "2024-02-28",
      nextVaccination: "2024-08-28",
      status: "Up to Date",
      vaccinationCount: 4,
    },
  ]

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.contact.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Up to Date":
        return <Badge className="bg-green-100 text-green-800">Up to Date</Badge>
      case "Due Soon":
        return <Badge className="bg-yellow-100 text-yellow-800">Due Soon</Badge>
      case "Overdue":
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
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
          <h2 className="text-2xl font-bold tracking-tight">Patient Oversight</h2>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 flex-1">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search patients by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Last Vaccination</TableHead>
              <TableHead>Next Vaccination</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>{patient.dateOfBirth}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">{patient.contact}</div>
                      <div className="text-xs text-gray-500">{patient.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{patient.lastVaccination}</TableCell>
                  <TableCell>{patient.nextVaccination}</TableCell>
                  <TableCell>{getStatusBadge(patient.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  {searchQuery ? "No patients found matching your search" : "No patients found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div>
          Showing {filteredPatients.length} of {patients.length} patients
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
