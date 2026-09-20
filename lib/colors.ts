export const COLORS = {
  plum: "bg-[#4B2E3F] text-[#FAF9F6]",
  rose: "bg-[#D8B4A6] text-[#4B2E3F]",
  sage: "bg-[#A7B69F] text-[#4B2E3F]",
  beige: "bg-[#F7EDE7] text-[#4B2E3F]",
  ochre: "bg-[#D4A537] text-[#4B2E3F]",
  clay: "bg-[#C17A5B] text-[#FAF9F6]",
  slate: "bg-[#6B7A8F] text-[#FAF9F6]",
  moss: "bg-[#5C7355] text-[#FAF9F6]",
} as const

export type ColorName = keyof typeof COLORS

export const COLOR_NAMES = Object.keys(COLORS) as ColorName[]

export function tone(color: string): string {
  return COLORS[color as ColorName] ?? COLORS.plum
}