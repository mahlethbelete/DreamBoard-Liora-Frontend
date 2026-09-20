"use client"

import { useState } from "react"

import { api } from "@/lib/api"
import type { ImageResult } from "@/lib/types"

export function ImagePicker({
  value,
  seed,
  onPick,
}: {
  value: string
  seed?: string
  onPick: (url: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(seed ?? "")
  const [results, setResults] = useState<ImageResult[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  async function search() {
    if (query.trim().length < 2) return
    setError("")
    setBusy(true)
    try {
      const res = await api.searchImages(query.trim())
      setResults(res.results)
      if (res.results.length === 0) setError("Nothing found. Try other words.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm text-plum/60">Image</span>
        <button
          type="button"
          onClick={() => {
            setOpen(!open)
            if (!open && results.length === 0 && query) search()
          }}
          className="text-xs text-plum/55 underline-offset-2 hover:text-plum hover:underline"
        >
          {open ? "Hide search" : "Search photos"}
        </button>
      </div>

      {open && (
        <div className="mb-3 rounded-xl border border-plum/10 bg-white p-2">
          <div className="flex gap-2">
            <input
              value={query}
              placeholder="santorini, mountains, desk"
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              className="flex-1 rounded-lg bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-plum/30"
            />
            <button
              type="button"
              onClick={search}
              disabled={busy || query.trim().length < 2}
              className="rounded-lg bg-plum px-3 py-1.5 text-xs text-cream disabled:opacity-40"
            >
              {busy ? "..." : "Search"}
            </button>
          </div>

          {error && <p className="px-2 py-2 text-xs text-plum/60">{error}</p>}

          {results.length > 0 && (
            <div className="mt-2 grid max-h-52 grid-cols-4 gap-1.5 overflow-y-auto">
              {results.map((r) => (
                <button
                  key={r.url}
                  type="button"
                  onClick={() => {
                    onPick(r.url)
                    setOpen(false)
                  }}
                  className={`overflow-hidden rounded-lg ring-offset-1 transition hover:opacity-80 ${
                    value === r.url ? "ring-2 ring-plum" : ""
                  }`}
                >
                  
                  <img
                    src={r.thumb}
                    alt={r.alt}
                    className="h-16 w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <input
        value={value}
        placeholder="or paste a link"
        onChange={(e) => onPick(e.target.value)}
        className="w-full rounded-xl border border-plum/15 bg-white px-3.5 py-2.5 text-sm text-plum outline-none transition placeholder:text-plum/30 focus:border-plum/40 focus:ring-4 focus:ring-rose/25"
      />

      {value && (
        
        <img
          src={value}
          alt=""
          className="mt-2 h-32 w-full rounded-xl object-cover"
          onError={(e) => (e.currentTarget.style.display = "none")}
          onLoad={(e) => (e.currentTarget.style.display = "block")}
        />
      )}
    </div>
  )
}