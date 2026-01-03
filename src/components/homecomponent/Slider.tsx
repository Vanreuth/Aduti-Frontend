"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay, { AutoplayType } from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Welcome to Aduti",
    subtitle: "Discover Amazing Products",
    description:
      "Shop the latest trends with exclusive deals and fast delivery.",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=800&fit=crop",
    buttonText: "Shop Now",
    buttonLink: "/shop",
  },
  {
    id: 2,
    title: "New Arrivals",
    subtitle: "Fresh Styles for 2025",
    description:
      "Explore our newest collection of premium products at unbeatable prices.",
    image:
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1920&h=800&fit=crop",
    buttonText: "Explore",
    buttonLink: "/product",
  },
  {
    id: 3,
    title: "Special Offers",
    subtitle: "Up to 50% Off",
    description:
      "Don't miss out on our limited-time discounts on selected items.",
    image:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&h=800&fit=crop",
    buttonText: "View Deals",
    buttonLink: "/shop",
  },
];

const contentVariants = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      mass: 1.1,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: "blur(6px)",
    transition: { duration: 0.2 },
  },
} as const;

export default function HeroSlider() {
  const autoplay = useMemo<AutoplayType>(
    () => Autoplay({ delay: 5000, stopOnInteraction: false }),
    []
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, skipSnaps: false },
    [autoplay]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi]
  );

  const handleMouseEnter = useCallback(() => autoplay.stop(), [autoplay]);
  const handleMouseLeave = useCallback(() => autoplay.play(), [autoplay]);
  const handleFocus = useCallback(() => autoplay.stop(), [autoplay]);
  const handleBlur = useCallback(() => autoplay.play(), [autoplay]);

  return (
    <div className="container-app">
      <section
        className="relative w-full overflow-hidden"
        aria-roledescription="carousel"
        aria-label="Hero slider"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocusCapture={handleFocus}
        onBlurCapture={handleBlur}
      >
        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {slides.map((slide, idx) => {
              const active = idx === selectedIndex;

              return (
                <div
                  key={slide.id}
                  className="relative min-w-0 flex-[0_0_100%]"
                  aria-roledescription="slide"
                  aria-label={`${idx + 1} of ${slides.length}`}
                >
                  <div className="relative w-full min-h-[520px] md:min-h-[640px] lg:min-h-[720px]">
                    {/* Image (slight zoom only for active slide) */}
                    <motion.div
                      className="absolute inset-0"
                      animate={{ scale: active ? 1.05 : 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 80,
                        damping: 18,
                        mass: 1.2,
                      }}
                    >
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        priority={idx === 0}
                        sizes="100vw"
                        className="object-cover"
                      />
                    </motion.div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/55" />

                    {/* Content */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="mx-auto max-w-5xl px-4">
                        <div className="mx-auto max-w-2xl text-center">
                          {/* Animate only the active slide content */}
                          <AnimatePresence mode="wait">
                            {active && (
                              <motion.div
                                key={slide.id}
                                variants={contentVariants}
                                initial="hidden"
                                animate="show"
                                exit="exit"
                              >
                                <p className="text-xs md:text-sm font-medium tracking-wide text-white/90">
                                  {slide.subtitle}
                                </p>

                                <h1 className="mt-3 text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                                  {slide.title}
                                </h1>

                                <p className="mt-4 text-sm md:text-lg text-white/85">
                                  {slide.description}
                                </p>

                                <div className="mt-7 flex items-center justify-center gap-3">
                                  <Button
                                    size="lg"
                                    className="bg-white text-black hover:bg-white/90 font-semibold px-8 rounded-full"
                                    asChild
                                  >
                                    <Link href={slide.buttonLink}>
                                      {slide.buttonText}
                                    </Link>
                                  </Button>

                                  <Button
                                    size="lg"
                                    variant="outline"
                                    className="rounded-full border-white/30 text-white bg-white/10 hover:bg-white/20"
                                    asChild
                                  >
                                    <Link href="/shop">Browse</Link>
                                  </Button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Arrows */}
        <button
          type="button"
          onClick={scrollPrev}
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 grid place-items-center h-10 w-10 md:h-11 md:w-11 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md transition text-white"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          type="button"
          onClick={scrollNext}
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 grid place-items-center h-10 w-10 md:h-11 md:w-11 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md transition text-white"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollTo(i)}
              className={cn(
                "h-2.5 rounded-full transition-all",
                i === selectedIndex
                  ? "w-8 bg-white"
                  : "w-2.5 bg-white/55 hover:bg-white/80"
              )}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === selectedIndex ? "true" : "false"}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
