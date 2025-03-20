"use client"

import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { DropdownMenuLabel } from "@/components/ui/dropdown-menu"

import { DropdownMenuContent } from "@/components/ui/dropdown-menu"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { DropdownMenu } from "@/components/ui/dropdown-menu"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, MoreHorizontal, Search } from "lucide-react"
import Link from "next/link"

// Mock data for doctors
const initialDoctors = [
  {
    id: 1,
    name: "Dr. John Doe",
    avatar: "/avatars/john-doe.jpg",
    department: "General Medicine",
    contact: "john.doe@example.com",
    schedule: "Mon, Wed, Fri",
    status: "active",
  },
  {
    id: 2,
    name: "Dr. Jane Smith",
    avatar: "/avatars/jane-smith.jpg",
    department: "Pediatrics",
    contact: "jane.smith@example.com",
    schedule: "Tue, Thu, Sat",
    status: "active",
  },
  {
    id: 3,
    name: "Dr. Mike Johnson",
    avatar: "/avatars/mike-johnson.jpg",
    department: "Cardiology",
    contact: "mike.johnson@example.com",
    schedule: "Mon, Tue, Wed",
    status: "inactive",
  },
  // Add more mock data as needed
]

export default function DoctorManagement() {
  const [doctors, setDoctors] = useState(initialDoctors)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortColumn, setSortColumn] = useState("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const filteredDoctors = doctors.filter((doctor) => doctor.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    if (!sortColumn) return 0
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
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
          <h2 className="text-2xl font-bold tracking-tight">Doctor Management</h2>
          <Badge variant="secondary">{doctors.length} Doctors</Badge>
        </div>
        <Button>Add New Doctor</Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          type="search"
          placeholder="Search doctors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-sm"
        />
      </div>

      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("name")} className="cursor-pointer">
                Name {sortColumn === "name" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("department")} className="cursor-pointer">
                Department {sortColumn === "department" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("contact")} className="cursor-pointer">
                Contact {sortColumn === "contact" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("schedule")} className="cursor-pointer">
                Schedule {sortColumn === "schedule" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("status")} className="cursor-pointer">
                Status {sortColumn === "status" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedDoctors.map((doctor, index) => (
              <TableRow key={doctor.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={doctor.avatar} alt={doctor.name} />
                      <AvatarFallback>
                        {doctor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span>{doctor.name}</span>
                  </div>
                </TableCell>
                <TableCell>{doctor.department}</TableCell>
                <TableCell>{doctor.contact}</TableCell>
                <TableCell>{doctor.schedule}</TableCell>
                <TableCell>
                  <Badge variant={doctor.status === "active" ? "success" : "secondary"}>{doctor.status}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Doctor</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Delete Doctor</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {sortedDoctors.length} of {doctors.length} doctors
        </p>
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

