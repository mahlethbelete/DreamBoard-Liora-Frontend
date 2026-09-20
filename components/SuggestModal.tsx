"use client"

import { useState } from "react"

import { api } from "@/lib/api"
import { Alert, Button, Sparkle } from "@/components/ui"
import type { Category, Suggestion } from "@/lib/types"

export function SuggestModal({
  categories,
  defaultCategoryId,
  onClose,
  onSaved,
}: {
  categories: Category[]
  defaultCategoryId?: number
  onClose: () => void
  onSaved: () => void
}) {
  const [prompt, setPrompt] = useState("")
  const [categoryId, setCategoryId] = useState(
    defaultCategoryId ?? categories[0]?.id ?? 0,
  )
  const [items, setItems] = useState<Suggestion[]>([])
  const [picked, setPicked] = useState<Set<number>>(new Set())
  const [error, setError] = useState("")
  const [thinking, setThinking] = useState(false)
  const [saving, setSaving] = useState(false)

  async function ask() {
    setError("")
    setItems([])
    setPicked(new Set())
    setThinking(true)
    try {
      const res = await api.suggest(prompt, Number(categoryId))
      setItems(res.suggestions)
      setPicked(new Set(res.suggestions.map((_, i) => i)))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not get suggestions")
    } finally {
      setThinking(false)
    }
  }

  function toggle(i: number) {
    const next = new Set(picked)
    if (next.has(i)) next.delete(i)
    else next.add(i)
    setPicked(next)
  }

  async function saveAll() {
    setSaving(true)
    setError("")
    try {
      for (const i of picked) {
        await api.createVisionItem({
          title: items[i].title,
          description: items[i].description,
          category_id: Number(categoryId),
          status: "not_started",
        })
      }
      onSaved()
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save")
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-plum/30 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="my-auto w-full max-w-lg rounded-2xl border border-plum/10 bg-cream p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="flex items-center gap-2 font-display text-xl">
              <Sparkle className="h-4 w-4 text-gold" />
              Help me dream
            </h2>
            <p className="mt-0.5 text-sm text-plum/55">
              Say what you are after and pick what fits.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-plum/40 transition hover:text-plum"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-2">
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            className="rounded-xl border border-plum/15 bg-white px-3 py-2.5 text-sm outline-none"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            value={prompt}
            placeholder="I want to travel more in Africa"
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && prompt.length > 2 && !thinking && ask()
            }
            className="flex-1 rounded-xl border border-plum/15 bg-white px-3.5 py-2.5 text-sm outline-none placeholder:text-plum/30 focus:border-plum/40 focus:ring-4 focus:ring-rose/25"
          />
        </div>

        <Button
          className="mt-3 w-full"
          onClick={ask}
          disabled={thinking || prompt.length < 3}
        >
          {thinking ? "Thinking" : "Suggest ideas"}
        </Button>

        {error && (
          <div className="mt-4">
            <Alert>{error}</Alert>
          </div>
        )}

        {thinking && (
          <div className="mt-5 space-y-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-beige" />
            ))}
          </div>
        )}

        {items.length > 0 && (
          <>
            <div className="mt-5 max-h-72 space-y-2 overflow-y-auto pr-1">
              {items.map((s, i) => (
                <button
                  key={s.title}
                  onClick={() => toggle(i)}
                  className={`flex w-full gap-3 rounded-xl border p-3 text-left transition ${
                    picked.has(i)
                      ? "border-plum/40 bg-white"
                      : "border-plum/10 bg-transparent opacity-50"
                  }`}
                >
                  <span
                    className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border text-[10px] ${
                      picked.has(i)
                        ? "border-plum bg-plum text-cream"
                        : "border-plum/25"
                    }`}
                  >
                    {picked.has(i) ? "✓" : ""}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">{s.title}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-plum/55">
                      {s.description}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-4 flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={saveAll}
                disabled={saving || picked.size === 0}
              >
                {saving ? "Saving" : `Save ${picked.size}`}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}