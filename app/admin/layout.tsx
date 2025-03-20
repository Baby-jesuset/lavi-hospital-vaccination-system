import type React from "react"
import { DashboardLayout } from "@/components/DashboardLayout"
import { LayoutDashboard, Users, Package, Calendar, ClipboardList, BarChart } from "lucide-react"
import { motion } from "framer-motion"

const adminSections = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Vaccinator Management", href: "/admin/vaccinator-management", icon: Users },
  { name: "Inventory Management", href: "/admin/inventory-management", icon: Package },
  { name: "Scheduling Management", href: "/admin/scheduling-management", icon: Calendar },
  { name: "Patient Oversight", href: "/admin/patient-oversight", icon: ClipboardList },
  { name: "Reports", href: "/admin/reports", icon: BarChart },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout role="admin" sections={adminSections}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </DashboardLayout>
  )
}

