"use client";

import { Suspense, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/lib/auth";
import {
  Alert,
  Button,
  Field,
  PasswordField,
  Spinner,
  Wordmark,
} from "@/components/ui";
import { useSearchParams } from "next/navigation";
import { Slideshow } from "@/components/Slideshow";
import { AUTH_SLIDES } from "@/lib/slides";

function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const params = useSearchParams();
  const justCreated = params.get("created") === "1";

  async function handleSubmit() {
    setError("");
    setBusy(true);
    try {
      await login(email, password);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not sign in");
      setBusy(false);
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

          <h1 className="font-display text-3xl">Welcome back</h1>
          <p className="mt-1.5 mb-7 text-sm text-plum/60">
            {justCreated
              ? "Board created. Sign in to open it."
              : "Your board is where you left it."}
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
            <Link
              href="/signup"
              className="font-medium text-plum underline-offset-4 hover:underline"
            >
              Make a board
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
