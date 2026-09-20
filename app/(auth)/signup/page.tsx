"use client"

import { useState } from "react"
import Link from "next/link"

import { useAuth } from "@/lib/auth"
import { Alert, Button, Field, Spinner, Wordmark } from "@/components/ui"

export default function SignupPage() {
  const { signup } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  const tooShort = password.length > 0 && password.length < 8

  async function handleSubmit() {
    setError("")
    setBusy(true)
    try {
      await signup(name, email, password)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create your board")
      setBusy(false)
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-beige p-12 lg:flex lg:flex-col lg:justify-end">
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-sage/35 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-rose/40 blur-3xl" />
        <div className="relative">
          <Wordmark className="text-5xl" />
          <p className="mt-1 text-xs tracking-[0.25em] text-plum/50">
            YOUR VISION. YOUR WAY.
          </p>
          <p className="mt-8 max-w-sm font-display text-2xl leading-snug text-plum/80">
            Not just dreams. Plans, steps, real life.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Wordmark className="text-3xl" />
          </div>

          <h1 className="font-display text-3xl">Make your board</h1>
          <p className="mt-1.5 mb-7 text-sm text-plum/60">
            Collect what matters. Plan what is next.
          </p>

          <div className="space-y-4">
            <Field
              label="Name"
              value={name}
              placeholder="Mahlet"
              onChange={(e) => setName(e.target.value)}
            />
            <Field
              label="Email"
              type="email"
              value={email}
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Field
              label="Password"
              type="password"
              value={password}
              placeholder="At least 8 characters"
              error={tooShort ? "Use at least 8 characters." : undefined}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />

            {error && <Alert>{error}</Alert>}

            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={busy || name.length < 2 || !email || password.length < 8}
            >
              {busy ? <Spinner /> : "Create board"}
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-plum/60">
            Already have one?{" "}
            <Link href="/login" className="font-medium text-plum underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
