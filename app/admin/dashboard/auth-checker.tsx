"use client"

import { useEffect } from "react"

interface AuthCheckerProps {
  onAuthSuccess: () => void
  onAuthFailure: () => void
}

export default function AuthChecker({ onAuthSuccess, onAuthFailure }: AuthCheckerProps) {
  useEffect(() => {
    // Client-side only authentication check
    const checkAuth = () => {
      if (typeof window === "undefined") return

      try {
        const authUser = localStorage.getItem("authUser")
        if (!authUser) {
          onAuthFailure()
          return
        }

        const user = JSON.parse(authUser)
        if (user.role !== "admin" || user.email !== "admin@lavihospital.com") {
          onAuthFailure()
          return
        }

        onAuthSuccess()
      } catch (error) {
        console.error("Auth check failed:", error)
        onAuthFailure()
      }
    }

    // Small delay to ensure client-side rendering
    const timer = setTimeout(checkAuth, 100)
    return () => clearTimeout(timer)
  }, [onAuthSuccess, onAuthFailure])

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-sm text-muted-foreground">Verifying credentials...</p>
      </div>
    </div>
  )
}
