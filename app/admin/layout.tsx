import type { ReactNode } from "react"
import { DashboardLayout } from "@/components/DashboardLayout"
// import { LayoutDashboard, Users, Package, Calendar, ClipboardList, BarChart } from "lucide-react"

const adminSections = [
  { name: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboardIcon" },
  // Removed Doctor Management item
  { name: "Vaccinator Management", href: "/admin/vaccinator-management", icon: "UsersIcon" },
  { name: "Inventory Management", href: "/admin/inventory-management", icon: "PackageIcon" },
  { name: "Scheduling Management", href: "/admin/scheduling-management", icon: "CalendarIcon" },
  { name: "Patient Oversight", href: "/admin/patient-oversight", icon: "ClipboardListIcon" },
  { name: "Reports", href: "/admin/reports", icon: "BarChartIcon" },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout role="admin" sections={adminSections}>
      {children}
    </DashboardLayout>
  )
}
