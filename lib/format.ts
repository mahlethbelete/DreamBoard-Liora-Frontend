import type { VisionStatus } from "./types"

export const STATUS_LABEL: Record<VisionStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  achieved: "Achieved",
}

export const STATUS_STYLE: Record<VisionStatus, string> = {
  not_started: "bg-beige text-plum/70",
  in_progress: "bg-rose/40 text-plum",
  achieved: "bg-sage/40 text-plum",
}

export function formatDate(iso: string | null): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 18) return "Good afternoon"
  return "Good evening"
}
