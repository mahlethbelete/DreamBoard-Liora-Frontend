"use client"

import { useState } from "react"
import Link from "next/link"

import { useAuth } from "@/lib/auth"
import { Alert, Button, Field, PasswordField, Spinner, Wordmark } from "@/components/ui"

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  async function handleSubmit() {
    setError("")
    setBusy(true)
    try {
      await login(email, password)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not sign in")
      setBusy(false)
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-beige p-12 lg:flex lg:flex-col lg:justify-end">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-rose/40 blur-3xl" />
        <div className="absolute bottom-10 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-[50%] bg-sage/30 blur-3xl" />
        <div className="relative">
          <Wordmark className="text-5xl" />
          <p className="mt-1 text-xs tracking-[0.25em] text-plum/50">
            YOUR VISION. YOUR WAY.
          </p>
          <p className="mt-8 max-w-sm font-display text-2xl leading-snug text-plum/80">
            A calm space to plan, collect and bring your dreams to life.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Wordmark className="text-3xl" />
          </div>

          <h1 className="font-display text-3xl">Welcome back</h1>
          <p className="mt-1.5 mb-7 text-sm text-plum/60">
            Your board is where you left it.
          </p>

          <div className="space-y-4">
            <Field
              label="Email"
              type="email"
              value={email}
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <PasswordField
              label="Password"
              value={password}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />

            {error && <Alert>{error}</Alert>}

            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={busy || !email || !password}
            >
              {busy ? <Spinner /> : "Sign in"}
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-plum/60">
            New here?{" "}
            <Link href="/signup" className="font-medium text-plum underline-offset-4 hover:underline">
              Make a board
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
