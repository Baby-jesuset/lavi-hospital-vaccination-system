// Simple client-side authentication utility

// Types
type UserRole = "admin" | "doctor" | "patient"

interface AuthUser {
  email: string
  role: UserRole
  isAuthenticated: boolean
}

// Sign in user
export const signIn = (email: string, role: UserRole): void => {
  const user: AuthUser = {
    email,
    role,
    isAuthenticated: true,
  }

  localStorage.setItem("authUser", JSON.stringify(user))
}

// Sign out user
export const signOut = (): void => {
  localStorage.removeItem("authUser")
}

// Get current user
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

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const user = getCurrentUser()
  return !!user?.isAuthenticated
}

// Check if user has specific role
export const hasRole = (role: UserRole): boolean => {
  const user = getCurrentUser()
  return !!user?.isAuthenticated && user.role === role
}

// Check if user is admin
export const isAdmin = (): boolean => {
  const user = getCurrentUser()
  return !!user?.isAuthenticated && user.role === "admin" && user.email === "admin@lavihospital.com"
}
