"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { api } from "@/lib/api";
import { Alert, Button } from "@/components/ui";
import type { Category, VisionItem } from "@/lib/types";
import { COLOR_NAMES, COLORS, tone } from "@/lib/colors";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<VisionItem[]>([]);
  const [name, setName] = useState("");
  const [newColor, setNewColor] = useState("plum");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const load = useCallback(async () => {
    const [cats, its] = await Promise.all([
      api.categories(),
      api.visionItems(),
    ]);
    setCategories(cats);
    setItems(its);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const itemsIn = (id: number) => items.filter((i) => i.category_id === id);

  async function create() {
    setError("");
    setBusy(true);
    try {
      await api.createCategory(name, newColor);
      setName("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create");
    } finally {
      setBusy(false);
    }
  }

  async function rename(id: number) {
    setError("");
    try {
      await api.updateCategory(id, { name: editName });
      setEditingId(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not rename");
    }
  }

  async function recolor(id: number, color: string) {
    try {
      await api.updateCategory(id, { color });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not change colour");
    }
  }

  async function remove(c: Category) {
    const n = itemsIn(c.id).length;
    const warning = n
      ? `Deleting "${c.name}" also deletes its ${n} ${n === 1 ? "item" : "items"}. Continue?`
      : `Delete "${c.name}"?`;

    if (!confirm(warning)) return;

    setError("");
    try {
      await api.deleteCategory(c.id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete");
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:px-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Categories</h1>
          <p className="mt-1 text-sm text-plum/55">
            The shelves your board is organised on.
          </p>
        </div>
        <p className="text-sm text-plum/45">
          {categories.length} {categories.length === 1 ? "shelf" : "shelves"} ·{" "}
          {items.length} saved
        </p>
      </header>

      <div className="mb-3 flex gap-2 rounded-2xl border border-plum/10 bg-white p-2">
        <input
          value={name}
          placeholder="Name a new shelf, like Places to go"
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && name.length >= 2 && create()}
          className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-plum/30"
        />
        <Button onClick={create} disabled={busy || name.length < 2}>
          Add
        </Button>
      </div>

      <div className="mb-8 flex gap-1.5 px-2">
        {COLOR_NAMES.map((cn) => (
          <button
            key={cn}
            onClick={() => setNewColor(cn)}
            aria-label={cn}
            className={`h-6 w-6 rounded-full transition ${COLORS[cn].split(" ")[0]} ${
              newColor === cn
                ? "ring-2 ring-plum ring-offset-2 ring-offset-cream"
                : "hover:scale-110"
            }`}
          />
        ))}
      </div>

      {error && (
        <div className="mb-6">
          <Alert>{error}</Alert>
        </div>
      )}

      {categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-plum/20 py-20 text-center">
          <p className="font-display text-2xl">No shelves yet</p>
          <p className="mx-auto mt-2 max-w-xs text-sm text-plum/55">
            Everything you save lives on a shelf. Make the first one above.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {categories.map((c) => {
            const mine = itemsIn(c.id);
            const done = mine.filter((x) => x.status === "achieved").length;
            const thumbs = mine.filter((x) => x.image_url).slice(0, 3);

            return (
              <div
                key={c.id}
                className={`group relative overflow-hidden rounded-2xl p-5 transition ${tone(
                  c.color,
                )}`}
              >
                {editingId === c.id ? (
                  <div className="flex gap-2">
                    <input
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && rename(c.id)}
                      className="flex-1 rounded-lg bg-white/90 px-3 py-1.5 text-sm text-plum outline-none"
                    />
                    <button
                      onClick={() => rename(c.id)}
                      className="text-sm font-medium"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-sm opacity-60"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/board?category=${c.id}`}
                        className="min-w-0"
                      >
                        <h2 className="truncate text-lg font-medium">
                          {c.name}
                        </h2>
                        <p className="mt-0.5 text-sm opacity-60">
                          {mine.length === 0
                            ? "Nothing saved"
                            : `${mine.length} saved · ${done} done`}
                        </p>
                      </Link>

                      <div className="flex shrink-0 gap-2 text-xs opacity-0 transition group-hover:opacity-70">
                        <button
                          onClick={() => {
                            setEditingId(c.id);
                            setEditName(c.name);
                          }}
                          className="hover:opacity-100"
                        >
                          Rename
                        </button>
                        <button
                          onClick={() => remove(c)}
                          className="hover:opacity-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex min-h-[56px] gap-2">
                      {thumbs.map((t) => (
                        <img
                          key={t.id}
                          src={t.image_url!}
                          alt=""
                          className="h-14 w-14 rounded-lg object-cover"
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          }
                        />
                      ))}
                    </div>

                    <div className="mt-3 flex gap-1 opacity-0 transition group-hover:opacity-100">
                      {COLOR_NAMES.map((cn) => (
                        <button
                          key={cn}
                          onClick={() => recolor(c.id, cn)}
                          aria-label={cn}
                          className={`h-4 w-4 rounded-full ring-1 ring-black/10 ${
                            COLORS[cn].split(" ")[0]
                          } ${c.color === cn ? "ring-2 ring-white" : ""}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
