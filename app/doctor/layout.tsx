import type React from "react"
import { DashboardLayout } from "@/components/DashboardLayout"
import { LayoutDashboard, Calendar, Syringe, FileText } from "lucide-react"

const doctorSections = [
  { name: "Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard },
  { name: "Appointment Management", href: "/doctor/appointment-management", icon: Calendar },
  { name: "Vaccination Administration", href: "/doctor/vaccination-administration", icon: Syringe },
  { name: "Patient Records", href: "/doctor/patient-records", icon: FileText },
]

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout role="doctor" sections={doctorSections}>
      {children}
    </DashboardLayout>
  )
}

