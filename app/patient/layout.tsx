import type { ReactNode } from "react"
import { DashboardLayout } from "@/components/DashboardLayout"
// Removed direct icon imports as they will be handled by DashboardLayout
// import { LayoutDashboard, Calendar, FileText, User } from "lucide-react"

const patientSections = [
  { name: "Dashboard", href: "/patient/dashboard", icon: "LayoutDashboardIcon" },
  { name: "Appointment Scheduling", href: "/patient/appointment-scheduling", icon: "CalendarIcon" },
  { name: "Vaccination Records", href: "/patient/vaccination-records", icon: "FileTextIcon" },
  { name: "Account Management", href: "/patient/account-management", icon: "UserIcon" },
]

export default function PatientLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout role="patient" sections={patientSections}>
      {children}
    </DashboardLayout>
  )
}
