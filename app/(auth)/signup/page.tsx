"use client"

import { useState } from "react"
import Link from "next/link"

import { useAuth } from "@/lib/auth"
import { Alert, Button, Field, PasswordField, Spinner, Wordmark } from "@/components/ui"
import { Slideshow } from "@/components/Slideshow"
import { AUTH_SLIDES } from "@/lib/slides"

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
            <section className="relative hidden overflow-hidden bg-plum lg:block">
        <Slideshow slides={AUTH_SLIDES} />
        <div className="absolute left-12 top-12 z-10">
          <Wordmark className="h-10 brightness-0 invert" />
          <p className="mt-2 text-xs tracking-[0.25em] text-cream/60">
            YOUR VISION. YOUR WAY.
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
            <PasswordField
              label="Password"
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
