"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { api } from "@/lib/api";
import { AddItemModal } from "@/components/AddItemModal";
import { VisionItemCard } from "@/components/VisionItemCard";
import { Button, Sparkle } from "@/components/ui";
import { SuggestModal } from "@/components/SuggestModal";

import type { Category, VisionItem, VisionStatus } from "@/lib/types";

const FILTERS: { value: VisionStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "not_started", label: "Not started" },
  { value: "in_progress", label: "In progress" },
  { value: "achieved", label: "Achieved" },
];

function Board() {
  const params = useSearchParams();
  const categoryParam = params.get("category");

  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<VisionItem[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(
    categoryParam ? Number(categoryParam) : null,
  );

  useEffect(() => {
    setCategoryId(categoryParam ? Number(categoryParam) : null);
  }, [categoryParam]);
  const [status, setStatus] = useState<VisionStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [editing, setEditing] = useState<VisionItem | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [cats, its] = await Promise.all([
      api.categories(),
      api.visionItems(categoryId ?? undefined),
    ]);
    setCategories(cats);
    setItems(its);
    setLoading(false);
  }, [categoryId]);

  useEffect(() => {
    load();
  }, [load]);

  const shown =
    status === "all" ? items : items.filter((i) => i.status === status);

  const activeCategory = categories.find((c) => c.id === categoryId);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 md:px-10 md:py-10">
      {activeCategory && (
        <Link
          href="/categories"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-plum/50 transition hover:text-plum"
        >
          <span aria-hidden>←</span> All categories
        </Link>
      )}
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">
            {activeCategory ? activeCategory.name : "Your vision board"}
          </h1>
          <p className="mt-1 text-sm text-plum/55">
            {items.length} saved ·{" "}
            {items.filter((i) => i.status === "achieved").length} done
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => setSuggesting(true)}
            disabled={!categories.length}
          >
            <Sparkle className="h-3.5 w-3.5 text-gold" />
            Help me dream
          </Button>
          <Button onClick={() => setAdding(true)} disabled={!categories.length}>
            Save something
          </Button>
        </div>
      </header>

      <div className="no-bar mb-4 flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setCategoryId(null)}
          className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm transition ${
            categoryId === null
              ? "bg-plum text-cream"
              : "border border-plum/15 text-plum/60 hover:bg-beige"
          }`}
        >
          Everything
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategoryId(c.id)}
            className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm transition ${
              categoryId === c.id
                ? "bg-plum text-cream"
                : "border border-plum/15 text-plum/60 hover:bg-beige"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="mb-7 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatus(f.value)}
            className={`text-sm transition ${
              status === f.value
                ? "font-medium text-plum underline underline-offset-4"
                : "text-plum/45 hover:text-plum"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="columns-2 gap-4 md:columns-3 xl:columns-4">
          {[180, 130, 220, 160, 200, 140].map((h, i) => (
            <div
              key={i}
              style={{ height: h }}
              className="mb-4 animate-pulse break-inside-avoid rounded-2xl bg-beige"
            />
          ))}
        </div>
      ) : shown.length === 0 ? (
        <div className="py-20 text-center">
          <Sparkle className="mx-auto mb-4 h-6 w-6 text-gold" />
          <p className="font-display text-2xl">Nothing here yet</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-plum/55">
            Save the first thing you want. A photo, a link, or just the words
            will do.
          </p>
          {categories.length > 0 && (
            <Button className="mt-5" onClick={() => setAdding(true)}>
              Save something
            </Button>
          )}
        </div>
      ) : (
        <div className="columns-2 gap-4 md:columns-3 xl:columns-4">
          {shown.map((item) => (
            <VisionItemCard
              key={item.id}
              item={item}
              onChange={load}
              onEdit={() => setEditing(item)}
            />
          ))}
        </div>
      )}

      {adding && (
        <AddItemModal
          categories={categories}
          defaultCategoryId={categoryId ?? undefined}
          onClose={() => setAdding(false)}
          onSaved={load}
        />
      )}
      {suggesting && (
        <SuggestModal
          categories={categories}
          defaultCategoryId={categoryId ?? undefined}
          onClose={() => setSuggesting(false)}
          onSaved={load}
        />
      )}
      {editing && (
        <AddItemModal
          categories={categories}
          item={editing}
          onClose={() => setEditing(null)}
          onSaved={load}
        />
      )}
    </div>
  );
}

export default function BoardPage() {
  return (
    <Suspense fallback={<div className="p-10 text-plum/40">Loading</div>}>
      <Board />
    </Suspense>
  );
}
