import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, FileText, Bell } from "lucide-react"

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold">
            Lavi Hospital
          </Link>
          <div className="space-x-4">
            <Link href="/signin">
              <Button variant="ghost">Patient Sign In</Button>
            </Link>
            <Link href="/staff-signin">
              <Button variant="default">Staff Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to Lavi Hospital
            <br />
            Vaccination System
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Streamlining vaccination processes for better healthcare management and patient care.
          </p>
          <Link href="/register">
            <Button size="lg" className="mb-16">
              Register as a Patient
            </Button>
          </Link>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Scheduling</h3>
              <p className="text-gray-600">Book your vaccination appointments with just a few clicks</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Digital Records</h3>
              <p className="text-gray-600">Access your vaccination history and certificates anytime</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Reminders</h3>
              <p className="text-gray-600">Never miss a vaccination with automated notifications</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          © 2024 Lavi Hospital. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

