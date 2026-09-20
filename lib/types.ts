export type User = {
  id: number
  name: string
  email: string
  created_at: string
  updated_at: string
}

export type Category = {
  id: number
  user_id: number
  name: string
  color: string
  created_at: string
  updated_at: string
}

export type VisionStatus = "not_started" | "in_progress" | "achieved"

export type VisionItem = {
  id: number
  user_id: number
  category_id: number
  title: string
  description: string | null
  image_url: string | null
  target_date: string | null
  status: VisionStatus
  created_at: string
  updated_at: string
}

export type VisionItemInput = {
  title: string
  description?: string | null
  image_url?: string | null
  target_date?: string | null
  category_id: number
  status?: VisionStatus
}

export type Suggestion = {
  title: string
  description: string
}

export type ImageResult = {
  url: string
  thumb: string
  alt: string
}