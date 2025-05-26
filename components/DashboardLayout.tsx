"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
<<<<<<< HEAD
import { Menu, X, ChevronDown, Bell, Sun, Moon, LogOut, LayoutDashboard, Calendar, FileText, User, Users, Package, ClipboardList, BarChart } from "lucide-react"
=======
import { Menu, X, ChevronDown, Bell, Sun, Moon, LogOut } from "lucide-react"
>>>>>>> 595bee3463104cee9216762a786993bc50791b83
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"

interface DashboardLayoutProps {
  children: React.ReactNode
  role: "admin" | "doctor" | "patient"
  sections: {
    name: string
    href: string
<<<<<<< HEAD
    icon: string
=======
    icon: React.ElementType
>>>>>>> 595bee3463104cee9216762a786993bc50791b83
  }[]
}

const roleInfo = {
  admin: {
    name: "Administrator",
    email: "admin@lavihospital.com",
    avatar: "/admin-avatar.jpg",
  },
  doctor: {
    name: "Dr. John Doe",
    email: "john.doe@lavihospital.com",
    avatar: "/doctor-avatar.jpg",
  },
  patient: {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    avatar: "/patient-avatar.jpg",
  },
}

<<<<<<< HEAD
const iconMap: { [key: string]: React.ElementType } = {
  LayoutDashboardIcon: LayoutDashboard,
  CalendarIcon: Calendar,
  FileTextIcon: FileText,
  UserIcon: User,
  UsersIcon: Users,
  PackageIcon: Package,
  ClipboardListIcon: ClipboardList,
  BarChartIcon: BarChart,
};

=======
>>>>>>> 595bee3463104cee9216762a786993bc50791b83
export function DashboardLayout({ children, role, sections }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark")
    localStorage.setItem("theme", newTheme)
  }

  const handleSignOut = () => {
    toast({
      title: "Signing out...",
      description: "You will be redirected to the login page.",
    })
    // Add actual sign out logic here
  }

  if (!mounted) {
    return null
  }

  return (
    <div
      className={cn("min-h-screen transition-colors duration-300", theme === "dark" ? "bg-gray-900" : "bg-gray-100/40")}
    >
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden transition-opacity duration-300 ease-in-out"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Sidebar Header */}
        <div
          className={cn(
            "h-16 flex items-center justify-between px-4 border-b",
            theme === "dark" ? "border-gray-700" : "border-gray-200",
          )}
        >
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-lg font-bold text-white">LH</span>
            </div>
            <span className={cn("text-lg font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>
              Lavi Hospital
            </span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User Profile */}
        <div className={cn("p-4 border-b", theme === "dark" ? "border-gray-700" : "border-gray-200")}>
          {isLoading ? (
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start px-2 hover:bg-transparent">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={roleInfo[role].avatar || "/placeholder.svg"} />
                      <AvatarFallback>{roleInfo[role].name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p
                        className={cn(
                          "text-sm font-medium line-clamp-1",
                          theme === "dark" ? "text-white" : "text-gray-900",
                        )}
                      >
                        {roleInfo[role].name}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{roleInfo[role].email}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                <DropdownMenuItem>Notifications</DropdownMenuItem>
                <DropdownMenuItem onClick={toggleTheme}>
                  {theme === "light" ? (
                    <>
                      <Moon className="mr-2 h-4 w-4" />
                      Dark Mode
                    </>
                  ) : (
                    <>
                      <Sun className="mr-2 h-4 w-4" />
                      Light Mode
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <ul className="space-y-1">
              {sections.map((section) => {
<<<<<<< HEAD
                const IconComponent = iconMap[section.icon]
=======
                const Icon = section.icon
>>>>>>> 595bee3463104cee9216762a786993bc50791b83
                const isActive = pathname === section.href

                return (
                  <li key={section.href}>
                    <Link href={section.href}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn("w-full justify-start transition-all duration-200", isActive && "font-medium")}
                        onClick={() => setSidebarOpen(false)}
                      >
<<<<<<< HEAD
                        {IconComponent && <IconComponent className={cn("mr-3 h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />}
=======
                        <Icon className={cn("mr-3 h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
>>>>>>> 595bee3463104cee9216762a786993bc50791b83
                        {section.name}
                      </Button>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header
          className={cn(
            "h-16 sticky top-0 z-30 border-b",
            theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
          )}
        >
          <div className="h-full px-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
              {isLoading ? (
                <Skeleton className="h-6 w-32" />
              ) : (
                <h1
                  className={cn(
                    "text-xl font-semibold hidden sm:block",
                    theme === "dark" ? "text-white" : "text-gray-900",
                  )}
                >
                  {sections.find((section) => section.href === pathname)?.name || "Dashboard"}
                </h1>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {isLoading ? (
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              ) : (
                <>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  </Button>
                  <div className={cn("h-6 w-px", theme === "dark" ? "bg-gray-700" : "bg-gray-200")} />
                  <Button variant="ghost" size="icon" onClick={toggleTheme}>
                    {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <div
            className="opacity-0 transform translate-y-4 transition-all duration-300 ease-in-out"
            style={{
              opacity: 1,
              transform: "translateY(0)",
            }}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
