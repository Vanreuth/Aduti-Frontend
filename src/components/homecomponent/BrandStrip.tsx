"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { fadeUpItem, staggerContainer } from "@/lib/utils";
import { getAllProducts } from "@/lib/api/product";

const MAX_BRANDS = 5;

const fallbackBrands = [
  "Fashionista",
  "TimeMaster",
  "ActivePro",
  "ColdGear",
  "EliteWear",
];

const brandStyles = [
  "text-[1.9rem] font-light uppercase tracking-[0.2em] text-zinc-800 sm:text-[2.1rem]",
  "text-[2.15rem] font-semibold uppercase tracking-[0.08em] text-zinc-900 sm:text-[2.5rem]",
  "text-[2.2rem] font-medium tracking-[0.01em] text-zinc-900 sm:text-[2.75rem]",
  "text-[2.4rem] font-black tracking-[-0.045em] text-black sm:text-[3.05rem]",
  "text-[1.85rem] font-semibold uppercase tracking-[0.08em] text-zinc-900 sm:text-[2.1rem]",
];

function normalizeBrand(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.toLowerCase() === "null") return null;
  return trimmed;
}

export default function BrandStrip() {
  const [brands, setBrands] = useState<string[]>(fallbackBrands);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const response = await getAllProducts({
          page: 0,
          size: 50,
          sortBy: "id",
          direction: "DESC",
        });

        if (!active) return;

        const counts = new Map<string, { name: string; count: number }>();
        for (const product of response.products ?? []) {
          const brand = normalizeBrand((product as { brand?: unknown }).brand);
          if (!brand) continue;

          const key = brand.toLowerCase();
          const current = counts.get(key);
          if (!current) {
            counts.set(key, { name: brand, count: 1 });
          } else {
            current.count += 1;
          }
        }

        const dynamicBrands = Array.from(counts.values())
          .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
          .map((item) => item.name)
          .slice(0, MAX_BRANDS);

        if (dynamicBrands.length > 0) {
          setBrands(dynamicBrands);
        }
      } catch {
        // keep fallback brands on network/API failure
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const renderedBrands = useMemo(() => brands.slice(0, MAX_BRANDS), [brands]);

  return (
    <section className="w-full bg-[#eceef1] py-14 sm:py-16 lg:py-20">
      <motion.div
        className="container-app"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        <ul className="grid grid-cols-2 items-center gap-x-8 gap-y-10 text-center sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-12">
          {renderedBrands.map((brand, index) => (
            <motion.li
              key={brand}
              variants={fadeUpItem}
              className="flex min-h-12 items-center justify-center"
            >
              <span
                className={`${brandStyles[index % brandStyles.length]} transition-opacity duration-300 hover:opacity-70`}
              >
                {brand}
              </span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
