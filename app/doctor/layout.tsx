"use client"

import type { ReactNode } from "react"
import { DashboardLayout } from "@/components/DashboardLayout"
import { LayoutDashboard, Calendar, Syringe, FileText } from "lucide-react"

const doctorSections = [
  { name: "Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard },
  { name: "Appointments", href: "/doctor/appointment-management", icon: Calendar },
  { name: "Vaccinations", href: "/doctor/vaccination-administration", icon: Syringe },
  { name: "Patients", href: "/doctor/patient-records", icon: FileText },
]

export default function DoctorLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout role="doctor" sections={doctorSections}>
      {children}
    </DashboardLayout>
  )
}
