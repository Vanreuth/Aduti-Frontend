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
  "text-[clamp(1.15rem,4.2vw,2rem)] font-light uppercase tracking-[0.12em] text-zinc-800",
  "text-[clamp(1.2rem,4.6vw,2.3rem)] font-semibold uppercase tracking-[0.08em] text-zinc-900",
  "text-[clamp(1.2rem,4.8vw,2.4rem)] font-medium tracking-[0.02em] text-zinc-900",
  "text-[clamp(1.3rem,5vw,2.6rem)] font-black tracking-[-0.03em] text-black",
  "text-[clamp(1.1rem,4.1vw,2rem)] font-semibold uppercase tracking-[0.07em] text-zinc-900",
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
    <section className="w-full bg-[#eceef1] py-10 sm:py-14 lg:py-20">
      <motion.div
        className="container-app"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        <ul className="grid grid-cols-2 items-center gap-x-5 gap-y-7 text-center sm:grid-cols-3 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-5 lg:gap-x-12">
          {renderedBrands.map((brand, index) => (
            <motion.li
              key={brand}
              variants={fadeUpItem}
              className="flex min-h-10 min-w-0 items-center justify-center sm:min-h-12"
            >
              <span
                className={`${brandStyles[index % brandStyles.length]} max-w-full break-words text-center leading-none transition-opacity duration-300 hover:opacity-70`}
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
