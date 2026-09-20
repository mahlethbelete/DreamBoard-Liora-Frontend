"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { api, clearToken, getToken } from "./api"
import type { User } from "./types"

type AuthValue = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!getToken()) {
      setLoading(false)
      return
    }

    api
      .me()
      .then(setUser)
      .catch(() => clearToken())
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      await api.login(email, password)
      setUser(await api.me())
      router.push("/dashboard")
    },
    [router]
  )

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      await api.signup(name, email, password)
      router.push("/login?created=1")
    },
    [router]
  )

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
    router.push("/login")
  }, [router])

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
