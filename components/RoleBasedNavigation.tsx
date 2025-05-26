"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

type NavItem = {
  href: string
  label: string
}

type RoleBasedNavigationProps = {
  role: "admin" | "doctor" | "patient"
}

const navItems: Record<RoleBasedNavigationProps["role"], NavItem[]> = {
  admin: [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/vaccinator-management", label: "Vaccinator Management" },
    { href: "/admin/inventory-management", label: "Inventory Management" },
    { href: "/admin/scheduling-management", label: "Scheduling Management" },
    { href: "/admin/patient-oversight", label: "Patient Oversight" },
    { href: "/admin/reports", label: "Reports" },
  ],
  doctor: [
    { href: "/doctor/dashboard", label: "Dashboard" },
    { href: "/doctor/appointment-management", label: "Appointment Management" },
    { href: "/doctor/vaccination-administration", label: "Vaccination Administration" },
    { href: "/doctor/patient-records", label: "Patient Records" },
  ],
  patient: [
    { href: "/patient/dashboard", label: "Dashboard" },
    { href: "/patient/appointment-scheduling", label: "Appointment Scheduling" },
    { href: "/patient/vaccination-records", label: "Vaccination Records" },
    { href: "/patient/account-management", label: "Account Management" },
  ],
}

export function RoleBasedNavigation({ role }: RoleBasedNavigationProps) {
  const pathname = usePathname()

  return (
    <nav className="flex space-x-4 mb-6">
      {navItems[role].map((item) => (
        <Link key={item.href} href={item.href}>
          <Button variant={pathname === item.href ? "default" : "outline"}>{item.label}</Button>
        </Link>
      ))}
    </nav>
  )
}
