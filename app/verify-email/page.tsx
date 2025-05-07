"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Mail, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifyEmailPage() {
  const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "error">("loading")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const token = searchParams.get("token")

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setVerificationStatus("error")
        return
      }

      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // For demo purposes, consider any token valid
        setVerificationStatus("success")
        toast({
          title: "Email verified successfully",
          description: "You can now sign in to your account.",
        })
      } catch (error) {
        setVerificationStatus("error")
        toast({
          variant: "destructive",
          title: "Verification failed",
          description: "Please try again or contact support.",
        })
      }
    }

    verifyEmail()
  }, [token, toast])

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
            <CardTitle className="text-2xl text-center">Email Verification</CardTitle>
            <CardDescription className="text-center">Verifying your email address</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4 pt-4">
            {verificationStatus === "loading" && (
              <>
                <div className="rounded-full bg-primary/10 p-3">
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Please wait while we verify your email address...
                </p>
              </>
            )}

            {verificationStatus === "success" && (
              <>
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-semibold text-green-600">Email Verified Successfully</h3>
                  <p className="text-sm text-muted-foreground">
                    Your email has been verified. You can now sign in to your account.
                  </p>
                </div>
              </>
            )}

            {verificationStatus === "error" && (
              <>
                <div className="rounded-full bg-red-100 p-3">
                  <XCircle className="h-12 w-12 text-red-600" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-semibold text-red-600">Verification Failed</h3>
                  <p className="text-sm text-muted-foreground">
                    We couldn't verify your email address. The link may have expired or is invalid.
                  </p>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            {verificationStatus === "success" && (
              <Button className="w-full" onClick={() => router.push("/signin")}>
                Sign In
              </Button>
            )}
            {verificationStatus === "error" && (
              <>
                <Button variant="secondary" className="w-full" onClick={() => setVerificationStatus("loading")}>
                  <Mail className="mr-2 h-4 w-4" />
                  Resend Verification Email
                </Button>
                <Button variant="outline" className="w-full" onClick={() => router.push("/signin")}>
                  Back to Sign In
                </Button>
              </>
            )}
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
