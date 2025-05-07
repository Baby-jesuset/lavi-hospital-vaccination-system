"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, Search, Plus, Upload, X, Edit, Trash2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { FormSection } from "@/components/forms/FormSection"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  createVaccinator,
  getVaccinators,
  getDepartments,
  vaccinatorFormSchema,
  type VaccinatorFormValues,
} from "./actions"
import { createLogger } from "@/utils/logging"

// Create a logger for this component
const logger = createLogger("VaccinatorManagement")

export default function VaccinatorManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [vaccinators, setVaccinators] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [filteredVaccinators, setFilteredVaccinators] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  // Initialize the form with React Hook Form
  const form = useForm<VaccinatorFormValues>({
    resolver: zodResolver(vaccinatorFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      departmentId: "",
      specialization: "",
      credentials: "",
      licenseNumber: "",
      status: "active",
      availableMonday: true,
      availableTuesday: true,
      availableWednesday: true,
      availableThursday: true,
      availableFriday: true,
      availableSaturday: false,
      availableSunday: false,
      workHoursStart: "09:00",
      workHoursEnd: "17:00",
      maxDailyAppointments: 20,
      password: "",
      confirmPassword: "",
    },
  })

  // Fetch vaccinators and departments on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        setError(null)
        logger.debug("Fetching vaccinators and departments")

        // Fetch vaccinators
        const vaccinatorsResult = await getVaccinators()
        if (vaccinatorsResult.success && vaccinatorsResult.data) {
          logger.debug(`Retrieved ${vaccinatorsResult.data.length} vaccinators`)
          setVaccinators(vaccinatorsResult.data)
          setFilteredVaccinators(vaccinatorsResult.data)
        } else {
          const errorMsg = vaccinatorsResult.message || "Failed to load vaccinators"
          logger.error("Failed to fetch vaccinators", errorMsg)
          setError(errorMsg)
          toast({
            title: "Error",
            description: errorMsg,
            variant: "destructive",
          })
        }

        // Fetch departments
        const departmentsResult = await getDepartments()
        if (departmentsResult.success && departmentsResult.data) {
          logger.debug(`Retrieved ${departmentsResult.data.length} departments`)
          setDepartments(departmentsResult.data)
        } else {
          const errorMsg = departmentsResult.message || "Failed to load departments"
          logger.error("Failed to fetch departments", errorMsg)
          toast({
            title: "Error",
            description: errorMsg,
            variant: "destructive",
          })
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "An unexpected error occurred"
        logger.error("Error fetching data", error)
        setError(errorMsg)
        toast({
          title: "Error",
          description: "Failed to load data. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  // Filter vaccinators based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredVaccinators(vaccinators)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = vaccinators.filter(
      (vaccinator) =>
        (vaccinator.first_name?.toLowerCase() || "").includes(query) ||
        (vaccinator.last_name?.toLowerCase() || "").includes(query) ||
        (vaccinator.email?.toLowerCase() || "").includes(query) ||
        (vaccinator.license_number?.toLowerCase() || "").includes(query) ||
        (vaccinator.departments?.name?.toLowerCase() || "").includes(query),
    )

    setFilteredVaccinators(filtered)
  }, [searchQuery, vaccinators])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setImagePreview(null)
  }

  const closeForm = () => {
    setShowAddForm(false)
    form.reset()
    setImagePreview(null)
  }

  // Handle form submission
  async function onSubmit(values: VaccinatorFormValues) {
    setIsSubmitting(true)
    try {
      logger.info("Submitting vaccinator form", { email: values.email })

      // Call the server action to create the vaccinator
      const result = await createVaccinator(values)

      if (result.success) {
        logger.info("Vaccinator created successfully", result.data)
        toast({
          title: "Success",
          description: result.message || "Vaccinator added successfully",
        })

        // Refresh the vaccinators list
        const vaccinatorsResult = await getVaccinators()
        if (vaccinatorsResult.success && vaccinatorsResult.data) {
          setVaccinators(vaccinatorsResult.data)
          setFilteredVaccinators(vaccinatorsResult.data)
        }

        closeForm()
      } else {
        logger.error("Failed to create vaccinator", result.message)
        toast({
          title: "Error",
          description: result.message || "Failed to add vaccinator",
          variant: "destructive",
        })

        // Set form errors if applicable
        if (result.message?.includes("email")) {
          form.setError("email", {
            type: "server",
            message: "This email is already registered in the system.",
          })
        }
      }
    } catch (error) {
      logger.error("Error adding vaccinator", error)

      let errorMessage = "Failed to add vaccinator. Please try again."

      if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format availability days for display
  const formatAvailability = (vaccinator: any) => {
    const days = []
    if (vaccinator.available_monday) days.push("Mon")
    if (vaccinator.available_tuesday) days.push("Tue")
    if (vaccinator.available_wednesday) days.push("Wed")
    if (vaccinator.available_thursday) days.push("Thu")
    if (vaccinator.available_friday) days.push("Fri")
    if (vaccinator.available_saturday) days.push("Sat")
    if (vaccinator.available_sunday) days.push("Sun")

    return days.join(", ") || "None"
  }

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "success"
      case "inactive":
        return "destructive"
      case "on_leave":
        return "warning"
      default:
        return "secondary"
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
          <h2 className="text-2xl font-bold tracking-tight">Vaccinator Management</h2>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          type="search"
          placeholder="Search vaccinators..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-sm"
        />
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Vaccinator
        </Button>
      </div>

      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Schedule</TableHead>
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
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-4 w-[150px]" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[120px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[80px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[70px] rounded-full" />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Skeleton className="h-9 w-16" />
                        <Skeleton className="h-9 w-16" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
            ) : filteredVaccinators.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  {vaccinators.length === 0 ? "No vaccinators found" : "No vaccinators match your search"}
                </TableCell>
              </TableRow>
            ) : (
              filteredVaccinators.map((vaccinator) => (
                <TableRow key={vaccinator.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {vaccinator.first_name?.charAt(0) || "?"}
                          {vaccinator.last_name?.charAt(0) || "?"}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">
                          {vaccinator.first_name || "Unknown"} {vaccinator.last_name || ""}
                        </div>
                        <div className="text-sm text-gray-500">{vaccinator.license_number || "No license"}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{vaccinator.departments?.name || "Unknown"}</TableCell>
                  <TableCell>
                    <div className="text-sm">{vaccinator.email || "No email"}</div>
                    <div className="text-sm text-gray-500">{vaccinator.phone || "No phone"}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{formatAvailability(vaccinator)}</div>
                    {vaccinator.work_hours_start && vaccinator.work_hours_end && (
                      <div className="text-xs text-gray-500">
                        {vaccinator.work_hours_start} - {vaccinator.work_hours_end}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadge(vaccinator.status || "inactive") as any}>
                      {(vaccinator.status || "inactive").replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {filteredVaccinators.length} of {vaccinators.length} vaccinators
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

      {/* Floating Action Button */}
      <Button
        className="h-14 w-14 rounded-full fixed bottom-8 right-8 shadow-lg flex items-center justify-center"
        size="icon"
        onClick={() => setShowAddForm(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Add Vaccinator Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Vaccinator</DialogTitle>
            <DialogDescription>Enter the details for the new vaccinator to create their account.</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Profile Image */}
              <FormSection title="Profile Image">
                <div className="flex items-center gap-4">
                  <div className="border-2 border-dashed rounded-md border-gray-300 w-32 h-32 flex flex-col items-center justify-center relative">
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Profile preview"
                          className="w-full h-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={clearImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-gray-400" />
                        <p className="text-xs text-center text-gray-500 mt-2">
                          Drag your image here
                          <br />
                          (jpg and png accepted)
                        </p>
                      </>
                    )}
                  </div>
                  <div>
                    <Input
                      id="profileImage"
                      type="file"
                      accept="image/jpeg,image/png"
                      className="hidden"
                      onChange={handleImageChange}
                      disabled={isSubmitting}
                    />
                    <Label htmlFor="profileImage" asChild>
                      <Button type="button" variant="outline" className="cursor-pointer" disabled={isSubmitting}>
                        Browse...
                      </Button>
                    </Label>
                  </div>
                </div>
              </FormSection>

              {/* Basic Information */}
              <FormSection title="Basic Information">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" disabled={isSubmitting} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" disabled={isSubmitting} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="departmentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments.map((department) => (
                              <SelectItem key={department.id} value={department.id}>
                                {department.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                          <Input placeholder="e.g., Pediatric Vaccination" disabled={isSubmitting} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="credentials"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Credentials</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., MD, PhD" disabled={isSubmitting} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="licenseNumber"
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
                </div>
              </FormSection>

              {/* Contact Information */}
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
                            placeholder="doctor@lavihospital.com"
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
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+1 (555) 123-4567" disabled={isSubmitting} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormSection>

              {/* Availability */}
              <FormSection title="Availability" description="Select the days when the vaccinator is available">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="availableMonday"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Monday</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="availableTuesday"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Tuesday</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="availableWednesday"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Wednesday</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="availableThursday"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Thursday</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="availableFriday"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Friday</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="availableSaturday"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Saturday</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="availableSunday"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Sunday</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </FormSection>

              {/* Security */}
              <FormSection title="Account Security">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" disabled={isSubmitting} {...field} />
                        </FormControl>
                        <FormDescription>
                          Must be at least 8 characters long, contain one uppercase letter, one number, and one special
                          character
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" disabled={isSubmitting} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormSection>

              {/* Working Hours */}
              <FormSection title="Working Hours">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="workHoursStart"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input type="time" disabled={isSubmitting} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="workHoursEnd"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input type="time" disabled={isSubmitting} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="maxDailyAppointments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Daily Appointments</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          disabled={isSubmitting}
                          {...field}
                          onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 20)}
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum number of appointments this vaccinator can handle per day
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormSection>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeForm} disabled={isSubmitting}>
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
                      Adding Vaccinator...
                    </>
                  ) : (
                    "Add Vaccinator"
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
