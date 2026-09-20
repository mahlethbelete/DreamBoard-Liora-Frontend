"use client"

import { useState } from "react"

import { api } from "@/lib/api"
import { Alert, Button, Field, Select } from "@/components/ui"
import type { Category, VisionItem, VisionStatus } from "@/lib/types"

const STATUSES: { value: VisionStatus; label: string }[] = [
  { value: "not_started", label: "Not started" },
  { value: "in_progress", label: "In progress" },
  { value: "achieved", label: "Achieved" },
]

export function AddItemModal({
  categories,
  defaultCategoryId,
  item,
  onClose,
  onSaved,
}: {
  categories: Category[]
  defaultCategoryId?: number
  item?: VisionItem
  onClose: () => void
  onSaved: () => void
}) {
  const editing = Boolean(item)

  const [title, setTitle] = useState(item?.title ?? "")
  const [description, setDescription] = useState(item?.description ?? "")
  const [imageUrl, setImageUrl] = useState(item?.image_url ?? "")
  const [targetDate, setTargetDate] = useState(
    item?.target_date ? item.target_date.slice(0, 10) : "",
  )
  const [status, setStatus] = useState<VisionStatus>(
    item?.status ?? "not_started",
  )
  const [categoryId, setCategoryId] = useState(
    item?.category_id ?? defaultCategoryId ?? categories[0]?.id ?? 0,
  )

  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  async function save() {
    setError("")
    setBusy(true)

    const payload = {
      title,
      description: description || null,
      image_url: imageUrl || null,
      target_date: targetDate ? new Date(targetDate).toISOString() : null,
      category_id: Number(categoryId),
      status,
    }

    try {
      if (item) await api.updateVisionItem(item.id, payload)
      else await api.createVisionItem(payload)
      onSaved()
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save")
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-plum/30 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="my-auto w-full max-w-md rounded-2xl border border-plum/10 bg-cream p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="font-display text-xl">
              {editing ? "Edit" : "Save something"}
            </h2>
            <p className="mt-0.5 text-sm text-plum/55">
              {editing
                ? "Change anything, including the image."
                : "A title and a category is enough."}
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

        <div className="space-y-4">
          <Field
            label="What is it"
            value={title}
            placeholder="e.g. Visit Santorini"
            onChange={(e) => setTitle(e.target.value)}
          />

          <Field
            label="Notes"
            value={description}
            placeholder="Optional"
            onChange={(e) => setDescription(e.target.value)}
          />

          <div>
            <Field
              label="Image link"
              value={imageUrl}
              placeholder="https://..."
              onChange={(e) => setImageUrl(e.target.value)}
            />
            {imageUrl && (
              <img
                src={imageUrl}
                alt=""
                className="mt-2 h-32 w-full rounded-xl object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
                onLoad={(e) => (e.currentTarget.style.display = "block")}
              />
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Category"
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>

            <Field
              label="Target date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>

          <div>
            <span className="mb-1.5 block text-sm text-plum/60">Status</span>
            <div className="flex gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStatus(s.value)}
                  className={`flex-1 rounded-xl border px-2 py-2 text-xs transition ${
                    status === s.value
                      ? "border-plum bg-plum text-cream"
                      : "border-plum/15 text-plum/60 hover:bg-beige"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {error && <Alert>{error}</Alert>}

          <div className="flex gap-3 pt-1">
            <Button variant="ghost" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={save}
              disabled={busy || !title || !categoryId}
            >
              {busy ? "Saving" : editing ? "Save changes" : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
