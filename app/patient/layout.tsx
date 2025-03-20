import type React from "react"
import { DashboardLayout } from "@/components/DashboardLayout"
import { LayoutDashboard, Calendar, FileText, User } from "lucide-react"

const patientSections = [
  { name: "Dashboard", href: "/patient/dashboard", icon: LayoutDashboard },
  { name: "Appointment Scheduling", href: "/patient/appointment-scheduling", icon: Calendar },
  { name: "Vaccination Records", href: "/patient/vaccination-records", icon: FileText },
  { name: "Account Management", href: "/patient/account-management", icon: User },
]

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout role="patient" sections={patientSections}>
      {children}
    </DashboardLayout>
  )
}

