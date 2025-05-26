<<<<<<< HEAD
// Simple client-side authentication utility

// Types
type UserRole = "admin" | "doctor" | "patient"

interface AuthUser {
=======
"use client"

// Simple client-side authentication utility
// This file is marked as client-side only to avoid SSR issues

// Types
export type UserRole = "admin" | "doctor" | "patient"

export interface AuthUser {
>>>>>>> 595bee3463104cee9216762a786993bc50791b83
  email: string
  role: UserRole
  isAuthenticated: boolean
}

<<<<<<< HEAD
// Sign in user
export const signIn = (email: string, role: UserRole): void => {
=======
// Client-side only functions
export const signIn = (email: string, role: UserRole): void => {
  if (typeof window === "undefined") return

>>>>>>> 595bee3463104cee9216762a786993bc50791b83
  const user: AuthUser = {
    email,
    role,
    isAuthenticated: true,
  }

  localStorage.setItem("authUser", JSON.stringify(user))
}

<<<<<<< HEAD
// Sign out user
export const signOut = (): void => {
  localStorage.removeItem("authUser")
}

// Get current user
=======
export const signOut = (): void => {
  if (typeof window === "undefined") return
  localStorage.removeItem("authUser")
}

>>>>>>> 595bee3463104cee9216762a786993bc50791b83
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

<<<<<<< HEAD
// Check if user is authenticated
export const isAuthenticated = (): boolean => {
=======
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false
>>>>>>> 595bee3463104cee9216762a786993bc50791b83
  const user = getCurrentUser()
  return !!user?.isAuthenticated
}

<<<<<<< HEAD
// Check if user has specific role
export const hasRole = (role: UserRole): boolean => {
=======
export const hasRole = (role: UserRole): boolean => {
  if (typeof window === "undefined") return false
>>>>>>> 595bee3463104cee9216762a786993bc50791b83
  const user = getCurrentUser()
  return !!user?.isAuthenticated && user.role === role
}

<<<<<<< HEAD
// Check if user is admin
export const isAdmin = (): boolean => {
=======
export const isAdmin = (): boolean => {
  if (typeof window === "undefined") return false
>>>>>>> 595bee3463104cee9216762a786993bc50791b83
  const user = getCurrentUser()
  return !!user?.isAuthenticated && user.role === "admin" && user.email === "admin@lavihospital.com"
}
