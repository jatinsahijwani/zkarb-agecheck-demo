"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, CheckCircle2, XCircle } from "lucide-react"
import { set } from "date-fns"

export function AgeVerificationForm() {
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [result, setResult] = useState<{
    isAdult: boolean
    age: number
  } | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    return age
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!dateOfBirth) return

  const age = calculateAge(dateOfBirth)
  const isAdult = age >= 18

  // Call API
  const res = await fetch("/api/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ age }),
  })
  const data = await res.json()
  console.log(data.verified.result);
  console.log(data.verified.publicSignals[0]);

  if (data.verified.result == true && data.verified.publicSignals[0] == 1) {
    setResult({ isAdult: true, age })
  }
  else {
    setResult({ isAdult: false, age })
  }

  // setResult({ isAdult, age })
  setIsSubmitted(true)
}

  const handleReset = () => {
    setDateOfBirth("")
    setResult(null)
    setIsSubmitted(false)
  }

  return (
    <div className="relative overflow-hidden w-full items-center">
      <img src="/btc.png" className="absolute blur-sm w-16 sm:w-24 top-5 left-10 opacity-80" alt="" />
      <img src="/btc.png" className="absolute blur-sm w-20 sm:w-28 bottom-20 left-[15%] opacity-80" alt="" />
      <img src="/btc.png" className="absolute blur-md w-24 sm:w-32 top-1/3 right-[20%] opacity-80" alt="" />
      <img src="/btc.png" className="absolute blur-sm w-16 sm:w-20 bottom-10 right-10 opacity-80" alt="" />
      <img src="/btc.png" className="absolute blur-sm w-12 sm:w-16 top-1 left-[80%] opacity-80" alt="" />
<div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-balance">Age Verification (Demo)</h1>
          <p className="text-muted-foreground text-pretty">Please enter your date of birth to verify your age</p>
        </div>

        <Card className="border-border/80 shadow-2xl bg-white z-20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Date of Birth</CardTitle>
            <CardDescription>We need to verify that you are 18 years or older</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dob" className="text-sm font-medium">
                    Date of Birth
                  </Label>
                  <div className="relative">
                    <Input
                      id="dob"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="pl-10"
                      required
                      max={new Date().toISOString().split("T")[0]}
                    />
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <Button type="submit" className="w-full hover:bg-black" disabled={!dateOfBirth}>
                  Verify Age
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-lg border ${
                    result?.isAdult
                      ? "bg-success/10 border-success/20 text-black"
                      : "bg-warning/10 border-warning/20 text-warning-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {result?.isAdult ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : (
                      <XCircle className="h-5 w-5 text-warning" />
                    )}
                    <div>
                      <p className="font-medium">{result?.isAdult ? "Access Granted" : "Access Restricted"}</p>
                      <p className="text-sm opacity-90">
                        {result?.isAdult ? " You are 18 or older." : " You must be 18 or older to access this content."}
                      </p>
                    </div>
                  </div>
                </div>

                <Button onClick={handleReset} variant="outline" className="w-full bg-transparent">
                  Check Another Date
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Your information is not stored and is only used for age verification
          </p>
        </div>
      </div>
    </div>
    </div>
  )
}
