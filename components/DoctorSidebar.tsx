"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Calendar, Syringe, FileText } from "lucide-react"

const navItems = [
  { href: "/doctor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/doctor/appointment-management", label: "Appointments", icon: Calendar },
  { href: "/doctor/vaccination-administration", label: "Vaccinations", icon: Syringe },
  { href: "/doctor/patient-records", label: "Patient Records", icon: FileText },
]

export function DoctorSidebar() {
  const pathname = usePathname()

  return (
    <nav className="space-y-2">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <Button variant={pathname === item.href ? "default" : "ghost"} className="w-full justify-start">
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        </Link>
      ))}
    </nav>
  )
}
