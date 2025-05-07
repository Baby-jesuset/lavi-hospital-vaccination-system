import { createServerClient } from "@supabase/ssr"
import type { cookies } from "next/headers"
import type { Database } from "@/types/database.types"
import { createLogger } from "@/utils/logging"

const logger = createLogger("supabaseServer")

// Create a singleton pattern for the server client
const serverClientInstance: ReturnType<typeof createServerClient<Database>> | null = null

export function createClient(cookieStore: ReturnType<typeof cookies>) {
  // Don't reuse the instance for server components since each request needs its own cookie context
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            logger.error("Error setting cookie", error)
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: "", ...options })
          } catch (error) {
            logger.error("Error removing cookie", error)
          }
        },
      },
    },
  )

  return supabase
}
