"use client"

// Simple client-side authentication utility
// This file is marked as client-side only to avoid SSR issues

// Types
export type UserRole = "admin" | "doctor" | "patient"

export interface AuthUser {
  email: string
  role: UserRole
  isAuthenticated: boolean
}

// Client-side only functions
export const signIn = (email: string, role: UserRole): void => {
  if (typeof window === "undefined") return

  const user: AuthUser = {
    email,
    role,
    isAuthenticated: true,
  }

  localStorage.setItem("authUser", JSON.stringify(user))
}

export const signOut = (): void => {
  if (typeof window === "undefined") return
  localStorage.removeItem("authUser")
}

export const getCurrentUser = (): AuthUser | null => {
  if (typeof window === "undefined") {
    return null
  }

  const userStr = localStorage.getItem("authUser")
  if (!userStr) {
    return null
  }

  try {
    return JSON.parse(userStr) as AuthUser
  } catch (error) {
    console.error("Error parsing auth user:", error)
    return null
  }
}

export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false
  const user = getCurrentUser()
  return !!user?.isAuthenticated
}

export const hasRole = (role: UserRole): boolean => {
  if (typeof window === "undefined") return false
  const user = getCurrentUser()
  return !!user?.isAuthenticated && user.role === role
}

export const isAdmin = (): boolean => {
  if (typeof window === "undefined") return false
  const user = getCurrentUser()
  return !!user?.isAuthenticated && user.role === "admin" && user.email === "admin@lavihospital.com"
}
