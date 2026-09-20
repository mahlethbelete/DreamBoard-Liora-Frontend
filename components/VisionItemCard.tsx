"use client"

import { useState } from "react"

import { api } from "@/lib/api"
import { STATUS_LABEL, STATUS_STYLE, formatDate } from "@/lib/format"
import type { VisionItem, VisionStatus } from "@/lib/types"

const NEXT: Record<VisionStatus, VisionStatus> = {
  not_started: "in_progress",
  in_progress: "achieved",
  achieved: "not_started",
}

export function VisionItemCard({
  item,
  onChange,
}: {
  item: VisionItem
  onChange: () => void
}) {
  const [busy, setBusy] = useState(false)
  const due = formatDate(item.target_date)

  async function cycleStatus() {
    setBusy(true)
    try {
      await api.updateVisionItem(item.id, { status: NEXT[item.status] })
      onChange()
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    if (!confirm(`Remove "${item.title}" from your board?`)) return
    setBusy(true)
    try {
      await api.deleteVisionItem(item.id)
      onChange()
    } finally {
      setBusy(false)
    }
  }

  return (
    <article
      className={`group mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-plum/10 bg-white transition ${
        busy ? "opacity-50" : ""
      }`}
    >
      {item.image_url && (
        <div className="relative">
          {/* plain img so any host works without next.config domains */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image_url}
            alt=""
            className="w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none"
            }}
          />
          <button
            onClick={remove}
            aria-label="Remove item"
            className="absolute right-2 top-2 rounded-full bg-cream/90 px-2 py-1 text-xs text-plum opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100"
          >
            Remove
          </button>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-semibold leading-snug">{item.title}</h3>
          {!item.image_url && (
            <button
              onClick={remove}
              aria-label="Remove item"
              className="shrink-0 text-xs text-plum/40 opacity-0 transition hover:text-plum group-hover:opacity-100 focus-visible:opacity-100"
            >
              Remove
            </button>
          )}
        </div>

        {item.description && (
          <p className="mt-1 text-sm leading-relaxed text-plum/60">
            {item.description}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            onClick={cycleStatus}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition hover:brightness-95 ${
              STATUS_STYLE[item.status]
            }`}
          >
            {STATUS_LABEL[item.status]}
          </button>
          {due && <span className="ml-auto text-xs text-plum/45">{due}</span>}
        </div>
      </div>
    </article>
  )
}
