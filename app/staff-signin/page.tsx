"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/utils/supabase"

export default function StaffSignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const validateForm = () => {
    if (!email || !password) {
      setError("Please fill in all fields")
      return false
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setError("Please enter a valid email address")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      // Check for admin credentials first
      if (email.toLowerCase() === "admin@lavihospital.com" && password === "Admin123!@#") {
        // Store admin session info in localStorage
        localStorage.setItem(
          "authUser",
          JSON.stringify({
            email: email.toLowerCase(),
            role: "admin",
            isAuthenticated: true,
          }),
        )

        toast({
          title: "Signed in successfully",
          description: "Welcome back, Administrator!",
        })
        router.push("/admin/dashboard")
        return
      }

      // For non-admin users, authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      console.log("Auth data:", authData)

      // Check if the user exists in the vaccinators table
      const { data: staffData, error: staffError } = await supabase
        .from("vaccinators")
        .select("*")
        .eq("auth_id", authData.user.id)
        .eq("status", "active") // Only allow active staff to sign in
        .single()

      if (staffError) {
        console.error("Staff query error:", staffError)
        throw new Error("User not found in vaccinator records or account is inactive")
      }

      console.log("Staff data:", staffData)

      if (!staffData) {
        throw new Error("User not found in vaccinator records")
      }

      // Store user session info in localStorage with explicit role
      localStorage.setItem(
        "authUser",
        JSON.stringify({
          id: staffData.vaccinator_id, // Use vaccinator_id instead of id
          auth_id: staffData.auth_id,
          email: staffData.email,
          name: `${staffData.first_name} ${staffData.last_name}`,
          role: "doctor", // Explicitly set role
          isAuthenticated: true,
        }),
      )

      toast({
        title: "Signed in successfully",
        description: `Welcome back, Dr. ${staffData.last_name}!`,
      })

      router.push("/doctor/dashboard")
    } catch (err: any) {
      console.error("Sign in error:", err)
      setError("Invalid email or password, or your account may be inactive")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign in. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-xl font-semibold text-primary">
            Lavi Hospital
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Staff Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your staff account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@lavihospital.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <Link href="/forgot-password" className="text-sm text-primary hover:underline w-full text-center">
              Forgot your password?
            </Link>
          </CardFooter>
        </Card>
      </main>

      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          © 2024 Lavi Hospital. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
