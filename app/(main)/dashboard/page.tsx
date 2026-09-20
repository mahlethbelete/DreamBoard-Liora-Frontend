"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"

import { api } from "@/lib/api"
import { useAuth } from "@/lib/auth"
import { greeting } from "@/lib/format"
import { AddItemModal } from "@/components/AddItemModal"
import { Button, Sparkle } from "@/components/ui"
import type { Category, VisionItem } from "@/lib/types"

import { Slideshow } from "@/components/Slideshow"
import { HOME_SLIDES } from "@/lib/slides"

export default function DashboardPage() {
  const { user } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [items, setItems] = useState<VisionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  const load = useCallback(async () => {
    const [cats, its] = await Promise.all([api.categories(), api.visionItems()])
    setCategories(cats)
    setItems(its)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const countFor = (id: number) =>
    items.filter((i) => i.category_id === id).length

  const recent = [...items]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 6)

  const done = items.filter((i) => i.status === "achieved").length
  const progress = items.length ? Math.round((done / items.length) * 100) : 0

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 md:px-10 md:py-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">
            {greeting()}, {user?.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-plum/55">Big dreams, steady steps.</p>
        </div>
        <Button onClick={() => setAdding(true)} disabled={!categories.length}>
          Save something
        </Button>
      </header>

      <section className="mb-10 grid gap-4 md:grid-cols-[1.6fr_1fr]">
        <div className="relative min-h-[220px] overflow-hidden rounded-2xl bg-plum">
          <Slideshow slides={HOME_SLIDES} interval={6000} />
        </div>

        <div className="rounded-2xl border border-plum/10 bg-white p-6">
          <p className="text-sm text-plum/55">Your progress</p>
          <p className="mt-2 font-display text-3xl">
            {done}
            <span className="text-plum/35"> / {items.length}</span>
          </p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-beige">
            <div
              className="h-full rounded-full bg-sage transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 text-xs text-plum/45">
            {done === 0
              ? "Nothing marked done yet."
              : `${progress}% of your board is real.`}
          </p>
        </div>
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-display text-xl">Your categories</h2>
          <Link
            href="/categories"
            className="text-sm text-plum/55 underline-offset-4 hover:text-plum hover:underline"
          >
            Manage
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-beige" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-plum/20 p-8 text-center">
            <p className="text-sm text-plum/60">
              Start with a category, like &quot;Places to go&quot;.
            </p>
            <Link href="/categories">
              <Button className="mt-4">Make a category</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c, i) => (
              <Link
                key={c.id}
                href={`/board?category=${c.id}`}
                className={`rounded-2xl p-5 transition hover:brightness-95 ${
                  ["bg-plum text-cream", "bg-rose", "bg-sage", "bg-beige"][i % 4]
                }`}
              >
                <p className="font-medium">{c.name}</p>
                <p className="mt-1 text-sm opacity-60">
                  {countFor(c.id)} {countFor(c.id) === 1 ? "item" : "items"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-display text-xl">Recently saved</h2>
          <Link
            href="/board"
            className="text-sm text-plum/55 underline-offset-4 hover:text-plum hover:underline"
          >
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="text-sm text-plum/50">Nothing saved yet.</p>
        ) : (
          <div className="no-bar flex gap-3 overflow-x-auto pb-2">
            {recent.map((item) => (
              <Link
                key={item.id}
                href={`/board?category=${item.category_id}`}
                className="w-40 shrink-0 overflow-hidden rounded-2xl border border-plum/10 bg-white"
              >
                <div className="h-24 bg-beige">
                  {item.image_url && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={item.image_url}
                      alt=""
                      className="h-24 w-full object-cover"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  )}
                </div>
                <p className="truncate px-3 py-2.5 text-sm">{item.title}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {adding && (
        <AddItemModal
          categories={categories}
          onClose={() => setAdding(false)}
          onSaved={load}
        />
      )}
    </div>
  )
}
