"use client"

import { useEffect, useState } from "react"

export type Slide = { src: string; line: string }

export function Slideshow({
  slides,
  interval = 5000,
}: {
  slides: Slide[]
  interval?: number
}) {
  const [i, setI] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % slides.length), interval)
    return () => clearInterval(t)
  }, [slides.length, interval])

  return (
    <div className="absolute inset-0">
      {slides.map((s, n) => (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          key={s.src}
          src={s.src}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            n === i ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-plum/55" />

      <div className="absolute inset-x-0 bottom-0 p-12">
        {slides.map((s, n) => (
          <p
            key={s.line}
            className={`font-display text-3xl leading-snug text-cream transition-all duration-700 ${
              n === i
                ? "opacity-100"
                : "pointer-events-none absolute opacity-0"
            }`}
          >
            {s.line}
          </p>
        ))}

        <div className="mt-6 flex gap-1.5">
          {slides.map((s, n) => (
            <button
              key={s.src}
              onClick={() => setI(n)}
              aria-label={`Slide ${n + 1}`}
              className={`h-1 rounded-full transition-all ${
                n === i ? "w-8 bg-cream" : "w-3 bg-cream/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}