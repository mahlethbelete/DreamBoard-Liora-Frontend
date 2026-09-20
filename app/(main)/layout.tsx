"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { Sidebar } from "@/components/Sidebar"
import { useAuth } from "@/lib/auth"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.replace("/login")
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <main className="grid min-h-screen place-items-center">
        <p className="font-display text-2xl text-plum/30">Liora</p>
      </main>
    )
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 md:h-screen md:overflow-y-auto">{children}</main>
    </div>
  )
}
