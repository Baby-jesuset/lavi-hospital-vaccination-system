"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Search, Plus, Filter, Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { FormSection } from "@/components/forms/FormSection"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"

// Force dynamic rendering to prevent prerender errors
export const dynamic = "force-dynamic"

// Define the vaccinator form schema
const vaccinatorFormSchema = z.object({
  image_url: z.string().optional(),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  license_number: z.string().min(1, "License number is required"),
  specialization: z.string().min(1, "Specialization is required"),
  department: z.string().min(1, "Department is required"),
  availability: z.string().optional(),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  status: z.enum(["active", "inactive"]).default("active"),
})

type VaccinatorFormValues = z.infer<typeof vaccinatorFormSchema>

// Define the vaccinator structure
interface StaffMember {
  id: string
  image_url: string | null
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string | null
  city: string | null
  state: string | null
  zip: string | null
  license_number: string
  specialization: string
  department: string
  availability: string | null
  username: string
  password?: string
  status: string
  created_at: string
  updated_at: string
}

export default function VaccinatorManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [vaccinators, setVaccinators] = useState<StaffMember[]>([])
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Initialize the form
  const form = useForm<VaccinatorFormValues>({
    resolver: zodResolver(vaccinatorFormSchema),
    defaultValues: {
      image_url: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      license_number: "",
      specialization: "",
      department: "",
      availability: "",
      username: "",
      password: "",
      status: "active",
    },
  })

  // Fetch vaccinators from the API
  const fetchVaccinators = async () => {
    try {
      setIsLoading(true)
      setError(null)
      console.log("Fetching vaccinators...")

      const response = await fetch("/api/staff/list")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("API Response:", result)

      // Handle different response formats
      let staffData: StaffMember[] = []

      if (result.data && Array.isArray(result.data)) {
        staffData = result.data
      } else if (Array.isArray(result)) {
        staffData = result
      } else {
        console.warn("Unexpected API response format:", result)
        staffData = []
      }

      setVaccinators(staffData)
    } catch (error: any) {
      console.error("Error fetching vaccinators:", error)
      setError(error.message || "Failed to load vaccinator data")
      toast({
        title: "Error",
        description: "Failed to load vaccinator data. Please refresh the page.",
        variant: "destructive",
      })
      // Set empty array on error to prevent filter issues
      setVaccinators([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchVaccinators()
  }, [])

  // Filter vaccinators based on search query and status - with safety checks
  const filteredVaccinators = Array.isArray(vaccinators)
    ? vaccinators.filter((vaccinator) => {
        const matchesSearch =
          vaccinator.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vaccinator.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vaccinator.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vaccinator.specialization?.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = filterStatus === "all" || vaccinator.status === filterStatus

        return matchesSearch && matchesStatus
      })
    : []

  // Handle form submission
  async function onSubmit(values: VaccinatorFormValues) {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      toast({
        title: "Vaccinator added successfully",
        description: `Dr. ${values.first_name} ${values.last_name} has been added to the system.`,
      })

      fetchVaccinators() // Refresh the vaccinator list
      setDialogOpen(false)
      form.reset()
    } catch (error: any) {
      console.error("Error adding vaccinator:", error)
      toast({
        title: "Error",
        description: "Failed to add vaccinator. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper function to get badge variant based on status
  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      default:
        return "outline"
    }
  }

  // Helper function to format status for display
  const formatStatus = (status: string) => {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"
  }

  // Safe calculation for stats
  const activeCount = Array.isArray(vaccinators) ? vaccinators.filter((v) => v.status === "active").length : 0
  const inactiveCount = Array.isArray(vaccinators) ? vaccinators.filter((v) => v.status === "inactive").length : 0
  const totalCount = Array.isArray(vaccinators) ? vaccinators.length : 0
  const specializationCount = Array.isArray(vaccinators) ? new Set(vaccinators.map((v) => v.specialization)).size : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight">Vaccinator Management</h2>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Select onValueChange={setFilterStatus} defaultValue={filterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2 flex-1 md:max-w-sm ml-auto">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search vaccinators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="rounded-md border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>License</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Skeleton loading state
              Array(5)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell>
                      <Skeleton className="h-4 w-[150px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[200px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[120px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[80px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[120px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[70px] rounded-full" />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Skeleton className="h-9 w-9" />
                        <Skeleton className="h-9 w-9" />
                        <Skeleton className="h-9 w-9" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="text-red-500 mb-2">Error loading data</div>
                  <p className="text-gray-500 mb-4">{error}</p>
                  <Button onClick={fetchVaccinators} variant="outline">
                    Try Again
                  </Button>
                </TableCell>
              </TableRow>
            ) : filteredVaccinators.length > 0 ? (
              filteredVaccinators.map((vaccinator) => (
                <TableRow key={vaccinator.id}>
                  <TableCell>
                    <div className="font-medium">
                      Dr. {vaccinator.first_name} {vaccinator.last_name}
                    </div>
                  </TableCell>
                  <TableCell>{vaccinator.email}</TableCell>
                  <TableCell>{vaccinator.phone}</TableCell>
                  <TableCell>{vaccinator.license_number}</TableCell>
                  <TableCell>{vaccinator.specialization}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(vaccinator.status)}>{formatStatus(vaccinator.status)}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="text-gray-500">No vaccinators found</div>
                  {searchQuery && (
                    <p className="text-sm text-gray-400 mt-2">Try adjusting your search or filter criteria</p>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {filteredVaccinators.length} of {totalCount} vaccinators
        </p>
        <div className="space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{activeCount}</div>
                <div className="text-sm text-gray-500">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{inactiveCount}</div>
                <div className="text-sm text-gray-500">Inactive</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalCount}</div>
                <div className="text-sm text-gray-500">Total Staff</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{specializationCount}</div>
                <div className="text-sm text-gray-500">Specializations</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Floating Action Button */}
      <Button
        className="h-14 w-14 rounded-full fixed bottom-8 right-8 shadow-lg flex items-center justify-center"
        size="icon"
        onClick={() => setDialogOpen(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Add New Vaccinator Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Staff Member</DialogTitle>
            <DialogDescription>Enter the details for the new staff member to add to the system.</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormSection title="Profile Image">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={form.getValues("image_url") || "/placeholder-avatar.jpg"} />
                    <AvatarFallback>
                      {form.getValues("first_name") ? form.getValues("first_name")?.charAt(0) : "U"}
                      {form.getValues("last_name") ? form.getValues("last_name")?.charAt(0) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <FormField
                      control={form.control}
                      name="image_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter image URL" disabled={isSubmitting} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </FormSection>

              <FormSection title="Basic Information">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Sarah" disabled={isSubmitting} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Johnson" disabled={isSubmitting} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormSection>

              <FormSection title="Contact Information">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="e.g., sarah.johnson@lavihospital.com"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., +1 (555) 123-4567" disabled={isSubmitting} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 123 Main St" disabled={isSubmitting} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Anytown" disabled={isSubmitting} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., CA" disabled={isSubmitting} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip Code</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 90210" disabled={isSubmitting} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormSection>

              <FormSection title="Professional Information">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="license_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., MD12345" disabled={isSubmitting} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialization</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select specialization" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Internal Medicine">Internal Medicine</SelectItem>
                              <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                              <SelectItem value="Family Medicine">Family Medicine</SelectItem>
                              <SelectItem value="Emergency Medicine">Emergency Medicine</SelectItem>
                              <SelectItem value="Infectious Disease">Infectious Disease</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="General Medicine">General Medicine</SelectItem>
                              <SelectItem value="Pediatric Medicine">Pediatric Medicine</SelectItem>
                              <SelectItem value="Family Practice">Family Practice</SelectItem>
                              <SelectItem value="Emergency Department">Emergency Department</SelectItem>
                              <SelectItem value="Vaccination Center">Vaccination Center</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Availability</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter availability details" disabled={isSubmitting} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormSection>

              <FormSection title="Security">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter username" disabled={isSubmitting} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter password" disabled={isSubmitting} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormSection>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Adding Staff Member...
                    </>
                  ) : (
                    "Add Staff Member"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
