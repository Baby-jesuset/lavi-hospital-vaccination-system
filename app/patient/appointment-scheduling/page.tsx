"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, ChevronRight, Plus, List, Grid, X, Loader2 } from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { FormSection } from "@/components/forms/FormSection"
import {
  type AppointmentFormValues,
  scheduleAppointment,
  getAvailableTimeSlots,
  getAvailableVaccinators,
} from "./actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { z } from "zod"

// Define the schema for appointment scheduling
const scheduleAppointmentSchema = z.object({
  purpose: z.string().min(1, { message: "Purpose is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  startTime: z.string().min(1, { message: "Time is required" }),
  vaccinatorId: z.string().min(1, { message: "Doctor is required" }),
  notes: z.string().optional(),
  notifyByEmail: z.boolean().default(true),
  notifyBySms: z.boolean().default(false),
})

export default function AppointmentScheduling() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([])
  const [availableVaccinators, setAvailableVaccinators] = useState<any[]>([])
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false)
  const [isLoadingVaccinators, setIsLoadingVaccinators] = useState(false)
  const [appointments, setAppointments] = useState<any[]>([])
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize the form with React Hook Form
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(scheduleAppointmentSchema),
    defaultValues: {
      purpose: "",
      date: "",
      startTime: "",
      vaccinatorId: "",
      notes: "",
      notifyByEmail: true,
      notifyBySms: false,
    },
  })

  // Watch for changes to date and time to update available vaccinators
  const watchDate = form.watch("date")
  const watchTime = form.watch("startTime")

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
    const calendarDays = []

    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)

      const isCurrentMonth = currentDate.getMonth() === month

      // Find appointments for this day
      const dayAppointments = appointments.filter((app) => {
        const appDate = new Date(app.appointment_date)
        return isSameDay(appDate, currentDate)
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

  // Fetch appointments when the component mounts
  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoadingAppointments(true)
      setError(null)
      try {
        const response = await fetch("/api/appointments/patient")
        if (!response.ok) {
          throw new Error("Failed to fetch appointments")
        }
        const data = await response.json()
        setAppointments(data)
      } catch (err) {
        console.error("Error fetching appointments:", err)
        setError("Failed to load appointments. Please try again later.")
        toast({
          title: "Error",
          description: "Failed to load appointments. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingAppointments(false)
      }
    }

    fetchAppointments()
  }, [toast])

  // Update available time slots when date changes
  useEffect(() => {
    if (watchDate) {
      const fetchTimeSlots = async () => {
        setIsLoadingTimeSlots(true)
        try {
          const result = await getAvailableTimeSlots(watchDate)
          if (result.success) {
            setAvailableTimeSlots(result.data || [])
          } else {
            toast({
              title: "Error",
              description: result.error || "Failed to load available time slots",
              variant: "destructive",
            })
          }
        } catch (err) {
          console.error("Error fetching time slots:", err)
          toast({
            title: "Error",
            description: "Failed to load available time slots",
            variant: "destructive",
          })
        } finally {
          setIsLoadingTimeSlots(false)
        }
      }

      fetchTimeSlots()
    }
  }, [watchDate, toast])

  // Update available vaccinators when date and time change
  useEffect(() => {
    if (watchDate && watchTime) {
      const fetchVaccinators = async () => {
        setIsLoadingVaccinators(true)
        try {
          const result = await getAvailableVaccinators(watchDate, watchTime)
          if (result.success) {
            setAvailableVaccinators(result.data || [])
          } else {
            toast({
              title: "Error",
              description: result.error || "Failed to load available vaccinators",
              variant: "destructive",
            })
          }
        } catch (err) {
          console.error("Error fetching vaccinators:", err)
          toast({
            title: "Error",
            description: "Failed to load available vaccinators",
            variant: "destructive",
          })
        } finally {
          setIsLoadingVaccinators(false)
        }
      }

      fetchVaccinators()
    }
  }, [watchDate, watchTime, toast])

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
  async function onSubmit(values: AppointmentFormValues) {
    setIsSubmitting(true)
    try {
      const result = await scheduleAppointment(values)

      if (result.success) {
        toast({
          title: "Appointment scheduled",
          description: "Your appointment has been scheduled successfully.",
        })
        setShowAddDialog(false)
        form.reset()

        // Refresh appointments
        const response = await fetch("/api/appointments/patient")
        if (response.ok) {
          const data = await response.json()
          setAppointments(data)
        }
      } else {
        // Handle field-specific errors
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, message]) => {
            form.setError(field as any, {
              type: "server",
              message,
            })
          })
        }

        toast({
          title: "Error",
          description: result.error || "Failed to schedule appointment. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error scheduling appointment:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format appointment time for display
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours, 10)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
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
          <div>
            <h1 className="text-3xl font-bold">Schedule Appointment</h1>
            <p className="text-muted-foreground mt-2">Book your vaccination appointment</p>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
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

      {isLoadingAppointments ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading appointments...</span>
        </div>
      ) : viewMode === "calendar" ? (
        <Card className="overflow-hidden">
          <div className="grid grid-cols-7 border-b">
            {weekdays.map((day, index) => (
              <div key={index} className="p-2 text-center font-medium text-sm">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 auto-rows-fr">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`min-h-[100px] p-1 border border-border relative ${
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
                  {day.appointments.slice(0, 2).map((app, idx) => (
                    <div key={idx} className="bg-primary/80 text-primary-foreground text-xs p-1 rounded mb-1 truncate">
                      {formatTime(app.appointment_time)} - {app.purpose}
                    </div>
                  ))}
                  {day.appointments.length > 2 && (
                    <div className="text-xs text-muted-foreground text-center">+{day.appointments.length - 2} more</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="p-4">
          {appointments.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No appointments scheduled</div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{appointment.purpose}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(appointment.appointment_date).toLocaleDateString()} at{" "}
                        {formatTime(appointment.appointment_time)}
                      </p>
                      <p className="text-sm mt-1">
                        Doctor: {appointment.vaccinator?.first_name} {appointment.vaccinator?.last_name}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Button variant="outline" size="sm" className="mr-2">
                        Reschedule
                      </Button>
                      <Button variant="destructive" size="sm">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Floating Action Button */}
      <Button
        className="h-14 w-14 rounded-full fixed bottom-8 right-8 shadow-lg flex items-center justify-center"
        size="icon"
        onClick={() => {
          setSelectedDate(new Date())
          form.setValue("date", new Date().toISOString().split("T")[0])
          setShowAddDialog(true)
        }}
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Add Appointment Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule Appointment</DialogTitle>
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
                          <SelectItem value="consultation">Vaccination Consultation</SelectItem>
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
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isSubmitting || isLoadingTimeSlots || !watchDate}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={isLoadingTimeSlots ? "Loading..." : "Select time"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isLoadingTimeSlots ? (
                              <SelectItem value="loading" disabled>
                                Loading available times...
                              </SelectItem>
                            ) : availableTimeSlots.length === 0 ? (
                              <SelectItem value="none" disabled>
                                No available times
                              </SelectItem>
                            ) : (
                              availableTimeSlots.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {formatTime(time)}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
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
                        disabled={isSubmitting || isLoadingVaccinators || !watchDate || !watchTime}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={isLoadingVaccinators ? "Loading..." : "Select doctor"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoadingVaccinators ? (
                            <SelectItem value="loading" disabled>
                              Loading available doctors...
                            </SelectItem>
                          ) : availableVaccinators.length === 0 ? (
                            <SelectItem value="none" disabled>
                              No available doctors
                            </SelectItem>
                          ) : (
                            availableVaccinators.map((vaccinator) => (
                              <SelectItem key={vaccinator.id} value={vaccinator.id}>
                                Dr. {vaccinator.first_name} {vaccinator.last_name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any specific requirements or information"
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
                <div className="flex gap-6">
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
                </div>
              </FormSection>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
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
