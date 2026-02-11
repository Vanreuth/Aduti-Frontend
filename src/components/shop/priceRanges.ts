export const priceRanges = [
  { label: "Any price", min: 0, max: Number.MAX_SAFE_INTEGER },
  { label: "$0 – $50", min: 0, max: 50 },
  { label: "$50 – $100", min: 50, max: 100 },
  { label: "$100 – $200", min: 100, max: 200 },
  { label: "$200 – $500", min: 200, max: 500 },
  { label: "$500+", min: 500, max: Number.MAX_SAFE_INTEGER },
] as const;
