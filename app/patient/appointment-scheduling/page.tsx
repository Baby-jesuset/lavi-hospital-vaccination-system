"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, ChevronRight, Plus, List, Grid, X, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { FormSection } from "@/components/forms/FormSection"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { format, parseISO } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"

// Define the patient appointment form schema with Zod
const patientAppointmentFormSchema = z.object({
  vaccinatorId: z.string().min(1, "Please select a doctor"),
  purpose: z.string().min(1, "Purpose is required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  description: z.string().optional(),
  notifyByEmail: z.boolean().default(true),
  notifyBySms: z.boolean().default(false),
  notifyByWhatsapp: z.boolean().default(false),
})

type PatientAppointmentFormValues = z.infer<typeof patientAppointmentFormSchema>

// Define the appointment type that matches what we get from Supabase
interface Appointment {
  appointment_id: string
  patient_id: string
  vaccinator_id: string
  purpose: string
  date_of_visit: string
  start_time: string
  end_time: string
  description: string | null
  notify_email: boolean
  notify_sms: boolean
  notify_whatsapp: boolean
  status: string
  created_at: string
  updated_at: string
  patients?: {
    patient_id: string
    first_name: string
    last_name: string
    email: string
  }
  vaccinators?: {
    vaccinator_id: string
    first_name: string
    last_name: string
    email: string
  }
}

interface Vaccinator {
  id: string
  first_name: string
  last_name: string
  email: string
}

interface Patient {
  patient_id: string
  first_name: string
  last_name: string
  email: string
}

// Define the calendar day type
interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  appointments: Appointment[]
}

// Define loading states for different data types
interface LoadingStates {
  appointments: boolean
  vaccinators: boolean
  patient: boolean
}

// Define error states for different data types
interface ErrorStates {
  appointments: string | null
  vaccinators: string | null
  patient: string | null
}

export default function PatientAppointmentScheduling() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [vaccinators, setVaccinators] = useState<Vaccinator[]>([])
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null)
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    appointments: true,
    vaccinators: true,
    patient: true,
  })
  const [errorStates, setErrorStates] = useState<ErrorStates>({
    appointments: null,
    vaccinators: null,
    patient: null,
  })
  const [serverError, setServerError] = useState<string | null>(null)

  // Initialize the form with React Hook Form
  const form = useForm<PatientAppointmentFormValues>({
    resolver: zodResolver(patientAppointmentFormSchema),
    defaultValues: {
      purpose: "",
      date: "",
      startTime: "",
      endTime: "",
      vaccinatorId: "",
      description: "",
      notifyByEmail: true,
      notifyBySms: false,
      notifyByWhatsapp: false,
    },
  })

  // Get current patient from API (simulated for demo)
  useEffect(() => {
    const fetchCurrentPatient = async () => {
      setLoadingStates((prev) => ({ ...prev, patient: true }))
      setErrorStates((prev) => ({ ...prev, patient: null }))

      // Clear any existing appointments when patient changes
      setAppointments([])

      try {
        const response = await fetch("/api/patients/current")

        if (!response.ok) {
          throw new Error("Failed to fetch current patient")
        }

        const data = await response.json()

        if (data.patient) {
          // Set the current patient and clear any previous state
          setCurrentPatient(data.patient)
          console.log("Current patient loaded successfully:", data.patient.patient_id)
        } else {
          throw new Error("No patient found")
        }
      } catch (error) {
        console.error("Error fetching current patient:", error)
        setErrorStates((prev) => ({ ...prev, patient: "Failed to load patient data" }))
      } finally {
        setLoadingStates((prev) => ({ ...prev, patient: false }))
      }
    }

    fetchCurrentPatient()
  }, [])

  // Check if any data is loading
  const isLoading = Object.values(loadingStates).some((state) => state)

  // Fetch patient's appointments for the current month
  const fetchAppointments = async () => {
    if (!currentPatient) {
      console.log("No patient available, skipping appointment fetch")
      setLoadingStates((prev) => ({ ...prev, appointments: false }))
      return
    }

    setLoadingStates((prev) => ({ ...prev, appointments: true }))
    setErrorStates((prev) => ({ ...prev, appointments: null }))

    try {
      // Get the first and last day of the current month
      const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
      const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

      const startDate = firstDay.toISOString().split("T")[0]
      const endDate = lastDay.toISOString().split("T")[0]

      // Make sure to include the patientId parameter to filter appointments
      const response = await fetch(
        `/api/appointments?startDate=${startDate}&endDate=${endDate}&patientId=${currentPatient.patient_id}`,
      )

      // Check if response is ok
      if (!response.ok) {
        // Check if response is HTML (server error page)
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("text/html")) {
          throw new Error(`Server error (${response.status}): Unable to load appointments`)
        }

        // Try to parse JSON error message
        try {
          const errorData = await response.json()
          throw new Error(errorData.error || `Failed to load appointments (${response.status})`)
        } catch (parseError) {
          throw new Error(`Failed to load appointments (${response.status})`)
        }
      }

      // Validate content type is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format from server")
      }

      const data = await response.json()

      // Clear any existing appointments before setting new ones
      setAppointments([])

      // Double check that we're only showing appointments for the current patient
      const patientAppointments = (data.data || []).filter(
        (appointment: Appointment) => appointment.patient_id === currentPatient.patient_id,
      )

      console.log(`Loaded ${patientAppointments.length} appointments for patient ${currentPatient.patient_id}`)
      setAppointments(patientAppointments)
    } catch (error: any) {
      console.error("Error fetching appointments:", error)
      const errorMessage = error.message || "Failed to load appointments"
      setErrorStates((prev) => ({ ...prev, appointments: errorMessage }))
      toast({
        title: "Error loading appointments",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoadingStates((prev) => ({ ...prev, appointments: false }))
    }
  }

  // Fetch vaccinators
  const fetchVaccinators = async () => {
    setLoadingStates((prev) => ({ ...prev, vaccinators: true }))
    setErrorStates((prev) => ({ ...prev, vaccinators: null }))

    try {
      const response = await fetch("/api/vaccinators/list")

      // Check if response is ok
      if (!response.ok) {
        // Check if response is HTML (server error page)
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("text/html")) {
          throw new Error(`Server error (${response.status}): Unable to load doctors`)
        }

        // Try to parse JSON error message
        try {
          const errorData = await response.json()
          throw new Error(errorData.error || `Failed to load doctors (${response.status})`)
        } catch (parseError) {
          throw new Error(`Failed to load doctors (${response.status})`)
        }
      }

      // Validate content type is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format from server")
      }

      const data = await response.json()
      setVaccinators(data.data || [])
    } catch (error: any) {
      console.error("Error fetching vaccinators:", error)
      const errorMessage = error.message || "Failed to load doctors"
      setErrorStates((prev) => ({ ...prev, vaccinators: errorMessage }))
      toast({
        title: "Error loading doctors",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoadingStates((prev) => ({ ...prev, vaccinators: false }))
    }
  }

  // Fetch data when component mounts or when currentMonth changes
  useEffect(() => {
    if (currentPatient) {
      fetchAppointments()
    }
  }, [currentMonth, currentPatient])

  // Fetch vaccinators only once when component mounts
  useEffect(() => {
    fetchVaccinators()
  }, [])

  // Refresh data periodically

  // Helper function to check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  // Generate calendar data
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    // Get the first day of the month
    const firstDay = new Date(year, month, 1)

    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay()

    // Calculate the number of days to show from the previous month
    const daysFromPrevMonth = firstDayOfWeek

    // Calculate the start date (might be from the previous month)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - daysFromPrevMonth)

    // We'll show 6 weeks (42 days) to ensure we have enough rows
    const calendarDays: CalendarDay[] = []

    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)

      const isCurrentMonth = currentDate.getMonth() === month

      // Filter appointments for this day
      const dayAppointments = appointments.filter((appointment) => {
        const appointmentDate = parseISO(appointment.date_of_visit)
        return isSameDay(appointmentDate, currentDate)
      })

      calendarDays.push({
        date: currentDate,
        isCurrentMonth,
        isToday: isSameDay(currentDate, new Date()),
        appointments: dayAppointments,
      })
    }

    return calendarDays
  }

  const calendarDays = generateCalendarDays()

  // Navigate to previous month
  const prevMonth = () => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(newDate.getMonth() - 1)
    setCurrentMonth(newDate)
  }

  // Navigate to next month
  const nextMonth = () => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(newDate.getMonth() + 1)
    setCurrentMonth(newDate)
  }

  // Set to today
  const goToToday = () => {
    setCurrentMonth(new Date())
  }

  // Format month and year for display
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  // Days of the week
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Handle form submission
  async function onSubmit(values: PatientAppointmentFormValues) {
    if (!currentPatient) {
      toast({
        title: "Error",
        description: "Unable to identify your account. Please try again later.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    setServerError(null)

    try {
      // Prepare data for API
      const appointmentData = {
        patient_id: currentPatient.patient_id,
        vaccinator_id: values.vaccinatorId,
        purpose: values.purpose,
        date_of_visit: values.date,
        start_time: values.startTime,
        end_time: values.endTime,
        status: "scheduled",
        description: values.description || null,
        notify_email: values.notifyByEmail,
        notify_sms: values.notifyBySms,
        notify_whatsapp: values.notifyByWhatsapp,
      }

      // Submit appointment to API
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      })

      // Check if response is ok
      if (!response.ok) {
        // Check if response is HTML (server error page)
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("text/html")) {
          throw new Error(`Server error (${response.status}): Unable to create appointment`)
        }

        // Try to parse JSON error message
        try {
          const errorData = await response.json()
          throw new Error(errorData.error || `Failed to create appointment (${response.status})`)
        } catch (parseError) {
          throw new Error(`Failed to create appointment (${response.status})`)
        }
      }

      // Validate content type is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format from server")
      }

      const data = await response.json()

      toast({
        title: "Appointment scheduled",
        description: "Your appointment has been scheduled successfully.",
      })

      // Refresh appointments
      fetchAppointments()

      setShowAddDialog(false)
      form.reset()
    } catch (error: any) {
      console.error("Error scheduling appointment:", error)
      const errorMessage = error.message || "An unexpected error occurred. Please try again."
      setServerError(errorMessage)

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Filter appointments for list view
  const filteredAppointments = appointments.filter((appointment) => {
    const vaccinatorName = appointment.vaccinators
      ? `${appointment.vaccinators.first_name} ${appointment.vaccinators.last_name}`
      : ""

    return (
      vaccinatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.status.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  // Render loading skeletons for appointments
  const renderAppointmentSkeletons = () => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <div key={index} className="border rounded-md p-3">
          <div className="flex justify-between items-start">
            <div>
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="text-right">
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <Skeleton className="h-4 w-32" />
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </div>
      ))
  }

  // Render empty state for appointments
  const renderEmptyAppointments = () => {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-medium mb-2">No appointments found</h3>
        <p className="text-muted-foreground mb-4">
          {errorStates.appointments
            ? "There was an error loading your appointments."
            : "You have no appointments scheduled for this month."}
        </p>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Appointment
        </Button>
      </div>
    )
  }

  // Render empty state for vaccinators
  const renderEmptyVaccinators = () => {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <p className="text-sm text-muted-foreground">
          {errorStates.vaccinators ? "Error loading doctors" : "No doctors available"}
        </p>
      </div>
    )
  }

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "no_show":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/patient/dashboard">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h2 className="text-2xl font-bold tracking-tight">My Appointments</h2>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-9 w-9" />
          <div className="ml-auto flex items-center space-x-2">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>

        <Card className="overflow-hidden">
          <div className="grid grid-cols-7 border-b">
            {weekdays.map((day, index) => (
              <div key={index} className="p-2 text-center font-medium text-sm">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 auto-rows-fr">
            {Array(42)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="min-h-[100px] p-1 border border-border relative bg-muted/20">
                  <Skeleton className="h-6 w-6 rounded-full ml-auto" />
                </div>
              ))}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/patient/dashboard">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight">My Appointments</h2>
        </div>
      </div>

      {/* Show error alerts */}
      {serverError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={goToToday}>
          Today
        </Button>

        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-lg font-medium w-40 text-center">{formatMonthYear(currentMonth)}</span>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>

        <div className="ml-auto flex items-center space-x-2">
          <Button
            variant={viewMode === "calendar" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("calendar")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" onClick={() => setViewMode("list")}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === "calendar" ? (
        <Card className="overflow-hidden">
          <div className="grid grid-cols-7 border-b">
            {weekdays.map((day, index) => (
              <div key={index} className="p-2 text-center font-medium text-sm">
                {day}
              </div>
            ))}
          </div>
          {loadingStates.appointments ? (
            <div className="grid grid-cols-7 auto-rows-fr">
              {Array(42)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="min-h-[100px] p-1 border border-border relative bg-muted/20">
                    <Skeleton className="h-6 w-6 rounded-full ml-auto" />
                  </div>
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 auto-rows-fr">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`min-h-[100px] p-1 border border-border relative cursor-pointer hover:bg-muted/50 ${
                    !day.isCurrentMonth ? "bg-muted/30 text-muted-foreground" : ""
                  } ${day.isToday ? "bg-primary/5" : ""}`}
                  onClick={() => {
                    // Don't allow scheduling in the past
                    if (day.date < new Date(new Date().setHours(0, 0, 0, 0))) {
                      toast({
                        title: "Cannot schedule in the past",
                        description: "Please select a future date for your appointment.",
                        variant: "destructive",
                      })
                      return
                    }

                    setSelectedDate(day.date)
                    form.setValue("date", day.date.toISOString().split("T")[0])
                    setShowAddDialog(true)
                  }}
                >
                  <div
                    className={`text-right p-1 ${
                      day.isToday
                        ? "bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center ml-auto"
                        : ""
                    }`}
                  >
                    {day.date.getDate()}
                  </div>
                  <div className="mt-1">
                    {day.appointments.map((appointment, idx) => (
                      <div
                        key={idx}
                        className="bg-primary/80 text-primary-foreground text-xs p-1 rounded mb-1 truncate"
                      >
                        {appointment.start_time.substring(0, 5)} - {appointment.purpose}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      ) : (
        <Card className="p-4">
          <Input
            type="search"
            placeholder="Search your appointments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm mb-4"
          />

          <div className="space-y-2">
            {loadingStates.appointments
              ? renderAppointmentSkeletons()
              : filteredAppointments.length > 0
                ? filteredAppointments.map((appointment) => (
                    <div
                      key={appointment.appointment_id}
                      className="border rounded-md p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{appointment.purpose}</h3>
                          <p className="text-sm text-muted-foreground">
                            Dr. {appointment.vaccinators ? `${appointment.vaccinators.last_name}` : "Unknown"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {format(parseISO(appointment.date_of_visit), "MMM dd, yyyy")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {appointment.start_time.substring(0, 5)} - {appointment.end_time.substring(0, 5)}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                            appointment.status,
                          )}`}
                        >
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          {appointment.status === "scheduled" && (
                            <Button variant="outline" size="sm">
                              Reschedule
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                : renderEmptyAppointments()}
          </div>
        </Card>
      )}

      {/* Floating Action Button */}
      <Button
        className="h-14 w-14 rounded-full fixed bottom-8 right-8 shadow-lg flex items-center justify-center"
        size="icon"
        onClick={() => setShowAddDialog(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Add Appointment Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
            <DialogDescription>Fill in the details to schedule your vaccination appointment.</DialogDescription>
          </DialogHeader>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowAddDialog(false)}
            className="absolute right-4 top-4"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>

          {serverError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormSection title="Appointment Details">
                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purpose of visit</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select purpose" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="covid19">COVID-19 Vaccination</SelectItem>
                          <SelectItem value="flu">Flu Vaccination</SelectItem>
                          <SelectItem value="tdap">Tdap Vaccination</SelectItem>
                          <SelectItem value="hepatitis">Hepatitis Vaccination</SelectItem>
                          <SelectItem value="consultation">Vaccination Consultation</SelectItem>
                          <SelectItem value="follow_up">Follow-up Visit</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of visit</FormLabel>
                        <FormControl>
                          <Input type="date" disabled={isSubmitting} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start time</FormLabel>
                        <FormControl>
                          <Input type="time" disabled={isSubmitting} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End time</FormLabel>
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
                  name="vaccinatorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Doctor</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isSubmitting || loadingStates.vaccinators}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={loadingStates.vaccinators ? "Loading doctors..." : "Select doctor"}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[200px]">
                          {loadingStates.vaccinators ? (
                            <div className="flex items-center justify-center py-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            </div>
                          ) : vaccinators.length > 0 ? (
                            vaccinators.map((vaccinator) => (
                              <SelectItem key={vaccinator.id} value={vaccinator.id}>
                                Dr. {vaccinator.first_name} {vaccinator.last_name}
                              </SelectItem>
                            ))
                          ) : (
                            renderEmptyVaccinators()
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any specific requirements or information for your appointment"
                          className="min-h-[80px]"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormSection>

              <FormSection title="Notification Preferences">
                <div className="flex flex-wrap gap-6">
                  <FormField
                    control={form.control}
                    name="notifyByEmail"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Email</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notifyBySms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>SMS</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notifyByWhatsapp"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>WhatsApp</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </FormSection>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)} disabled={isSubmitting}>
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
                      Scheduling...
                    </>
                  ) : (
                    "Schedule Appointment"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
