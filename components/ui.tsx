"use client"

import Image from "next/image"
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react"
import { useState } from "react"
export function Button({
  variant = "solid",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "ghost" | "quiet"
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum"

  const styles = {
    solid: "bg-plum text-cream hover:bg-plum/90",
    ghost: "border border-plum/15 text-plum hover:bg-beige",
    quiet: "text-plum/60 hover:text-plum",
  }[variant]

  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  )
}

export function Field({
  label,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-plum/60">{label}</span>
      <input
        className="w-full rounded-xl border border-plum/15 bg-white px-3.5 py-2.5 text-sm text-plum outline-none transition placeholder:text-plum/30 focus:border-plum/40 focus:ring-4 focus:ring-rose/25"
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-plum/70">{error}</span>}
    </label>
  )
}

export function Select({
  label,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-plum/60">{label}</span>
      <select
        className="w-full appearance-none rounded-xl border border-plum/15 bg-white px-3.5 py-2.5 text-sm text-plum outline-none transition focus:border-plum/40 focus:ring-4 focus:ring-rose/25"
        {...props}
      >
        {children}
      </select>
    </label>
  )
}

export function Alert({ children }: { children: ReactNode }) {
  if (!children) return null
  return (
    <p className="rounded-xl bg-rose/25 px-3.5 py-2.5 text-sm text-plum">
      {children}
    </p>
  )
}

export function Spinner() {
  return (
    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
  )
}

export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 0c.5 6.2 5.3 11 11.5 11.5C17.3 12 12.5 16.8 12 23c-.5-6.2-5.3-11-11.5-11.5C6.7 11 11.5 6.2 12 0Z" />
    </svg>
  )
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="Liora"
      width={140}
      height={40}
      priority
      className={`w-auto ${className}`}
    />
  )
}

export function PasswordField({
  label,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  const [show, setShow] = useState(false)

  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-plum/60">{label}</span>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          className="w-full rounded-xl border border-plum/15 bg-white px-3.5 py-2.5 pr-11 text-sm text-plum outline-none transition placeholder:text-plum/30 focus:border-plum/40 focus:ring-4 focus:ring-rose/25"
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-plum/40 transition hover:text-plum"
        >
          {show ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-[18px] w-[18px]">
              <path d="M9.9 4.24A9.1 9.1 0 0 1 12 4c7 0 10 8 10 8a18 18 0 0 1-2.16 3.19M6.6 6.6A18 18 0 0 0 2 12s3 8 10 8a9 9 0 0 0 5.4-1.6" />
              <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24M2 2l20 20" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-[18px] w-[18px]">
              <path d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8-10-8-10-8Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      {error && <span className="mt-1 block text-xs text-plum/70">{error}</span>}
    </label>
  )
}


