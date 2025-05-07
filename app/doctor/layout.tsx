import type { ReactNode } from "react"
import { DashboardLayout } from "@/components/DashboardLayout"
import { LayoutDashboard, Calendar, Syringe, Users } from "lucide-react"

const doctorSections = [
  { name: "Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard },
  { name: "Appointments", href: "/doctor/appointment-management", icon: Calendar },
  { name: "Vaccinations", href: "/doctor/vaccination-administration", icon: Syringe },
  { name: "Patients", href: "/doctor/patient-records", icon: Users },
]

export default function DoctorLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout role="doctor" sections={doctorSections}>
      {children}
    </DashboardLayout>
  )
}
