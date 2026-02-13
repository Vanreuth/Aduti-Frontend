"use client";

import type { ReactNode } from "react";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { motion } from "framer-motion";

type FiltersPanelProps = {
  title?: string;
  activeCount?: number;
  children: ReactNode;
};

export function FiltersPanel({
  title = "Filters",
  activeCount = 0,
  children,
}: FiltersPanelProps) {
  const showCount = activeCount > 0;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[250px] shrink-0">
        <div className="sticky top-6 border border-zinc-200 bg-white p-5">
          <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-zinc-900">
            <Filter className="h-4 w-4" />
            {title}
            {showCount ? (
              <Badge variant="secondary" className="rounded-full px-2 py-0 text-[10px]">
                {activeCount}
              </Badge>
            ) : null}
          </h2>
          {children}
        </div>
      </aside>

      {/* Mobile Filter Button */}
      <Sheet>
        <SheetTrigger asChild>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18, mass: 1.1 }}
            className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <Button
              variant="outline"
              className="rounded-full border-zinc-300 bg-white px-6 shadow-lg"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              {title}
              {showCount ? (
                <Badge
                  variant="secondary"
                  className="ml-2 rounded-full px-2 py-0 text-xs"
                >
                  {activeCount}
                </Badge>
              ) : null}
            </Button>
          </motion.div>
        </SheetTrigger>

        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              {title}
              {showCount ? (
                <Badge variant="secondary" className="rounded-full px-2 py-0 text-xs">
                  {activeCount}
                </Badge>
              ) : null}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6 pb-8">{children}</div>
        </SheetContent>
      </Sheet>
    </>
  );
}
