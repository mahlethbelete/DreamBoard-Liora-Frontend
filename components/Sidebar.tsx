"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Category } from "@/lib/types";
import { Wordmark } from "./ui";

const LINKS = [
  { href: "/dashboard", label: "Home" },
  { href: "/board", label: "Vision Board" },
  { href: "/categories", label: "Categories" },
];

export function Sidebar() {
  const pathname = usePathname();
  const params = useSearchParams();
  const active = params.get("category");
  const { user, logout } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const load = () =>
      api
        .categories()
        .then(setCategories)
        .catch(() => {});
    load();
    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, [pathname]);

  return (
    <aside className="shrink-0 border-b border-plum/10 bg-white px-5 py-4 md:flex md:h-screen md:w-60 md:flex-col md:justify-between md:border-b-0 md:border-r md:py-7">
      <div>
        <Link href="/dashboard" className="flex justify-center">
          <Wordmark className="h-12" />
        </Link>

        <nav className="mt-12 flex gap-0.5 overflow-x-auto md:flex-col md:overflow-visible">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`whitespace-nowrap rounded-xl px-3 py-2.5 text-sm transition ${
                pathname === l.href && !active
                  ? "bg-beige font-medium text-plum"
                  : "text-plum/55 hover:bg-beige/60 hover:text-plum"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {categories.length > 0 && (
          <div className="mt-8 hidden border-t border-plum/10 pt-7 md:block">
            <p className="mb-2.5 px-3 text-[11px] uppercase tracking-[0.15em] text-plum/30">
              Categories
            </p>
            <nav className="flex flex-col gap-0.5">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/board?category=${c.id}`}
                  className={`truncate rounded-xl px-3 py-1.5 text-sm transition ${
                    active === String(c.id)
                      ? "bg-beige font-medium text-plum"
                      : "text-plum/55 hover:bg-beige/60 hover:text-plum"
                  }`}
                >
                  {c.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>

      <div className="hidden border-t border-plum/10 pt-4 md:block">
        <p className="truncate text-sm font-medium">{user?.name}</p>
        <button
          onClick={logout}
          className="mt-1 text-xs text-plum/50 transition hover:text-plum"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
