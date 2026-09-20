import type { Category, User, VisionItem, VisionItemInput } from "./types"

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
const TOKEN_KEY = "liora_token"

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  }

  if (token) headers.Authorization = `Bearer ${token}`
  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json"
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers })

  if (res.status === 401) {
    clearToken()
    if (typeof window !== "undefined") window.location.href = "/login"
    throw new ApiError(401, "Your session expired. Sign in again.")
  }

  if (!res.ok) {
    let detail = "Something went wrong"
    try {
      const body = await res.json()
      if (typeof body.detail === "string") detail = body.detail
      else if (Array.isArray(body.detail)) detail = body.detail[0]?.msg ?? detail
    } catch {
      /* response had no JSON body */
    }
    throw new ApiError(res.status, detail)
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

export const api = {
  signup: (name: string, email: string, password: string) =>
    request<User>("/users/", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  login: async (email: string, password: string) => {
    const res = await fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username: email, password }),
    })

    if (!res.ok) {
      let detail = "Incorrect email or password"
      try {
        const body = await res.json()
        if (typeof body.detail === "string") detail = body.detail
      } catch {
        /* ignore */
      }
      throw new ApiError(res.status, detail)
    }

    const data: { access_token: string } = await res.json()
    setToken(data.access_token)
    return data
  },

  me: () => request<User>("/auth/me"),

  categories: () => request<Category[]>("/categories/"),

  createCategory: (name: string, color = "plum") =>
    request<Category>("/categories/", {
      method: "POST",
      body: JSON.stringify({ name, color }),
    }),

  updateCategory: (id: number, data: { name?: string; color?: string }) =>
    request<Category>(`/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteCategory: (id: number) =>
    request<void>(`/categories/${id}`, { method: "DELETE" }),

  visionItems: (categoryId?: number) =>
    request<VisionItem[]>(
      categoryId ? `/vision-items/?category_id=${categoryId}` : "/vision-items/"
    ),

  createVisionItem: (data: VisionItemInput) =>
    request<VisionItem>("/vision-items/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateVisionItem: (id: number, data: Partial<VisionItemInput>) =>
    request<VisionItem>(`/vision-items/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteVisionItem: (id: number) =>
    request<void>(`/vision-items/${id}`, { method: "DELETE" }),
}


