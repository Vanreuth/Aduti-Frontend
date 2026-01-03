"use client";

import React from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, fadeUpItem } from "@/lib/utils";

const CategorySection = () => {
  const categories = [
    {
      id: 1,
      title: "Women",
      subtitle: "Spring 2018",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop",
      cta: "SHOP NOW",
    },
    {
      id: 2,
      title: "Men",
      subtitle: "Spring 2018",
      image:
        "https://images.unsplash.com/photo-1552337480-48918be048b9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y29vbCUyMG1lbnxlbnwwfHwwfHx8MA%3D%3D",
      cta: "SHOP NOW",
    },
    {
      id: 3,
      title: "Accessories",
      subtitle: "New Trend",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
      cta: "EXPLORE",
    },
  ];

  return (
    <div className="container-app">
      <div className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Entrance animation (global) */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {categories.map((category) => (
              // This wrapper runs hidden/show entrance (fadeUpItem)
              <motion.div key={category.id} variants={fadeUpItem}>
                {/* This inner card handles rest/hover */}
                <motion.div
                  className="group relative h-80 rounded-xl overflow-hidden cursor-pointer shadow-lg"
                  initial="rest"
                  whileHover="hover"
                  animate="rest" // ✅ keep, but only if we also set variants on THIS element
                  variants={{
                    rest: {},
                    hover: {},
                  }}
                >
                  {/* Background image */}
                  <motion.div
                    className="absolute inset-0"
                    variants={{
                      rest: { scale: 1 },
                      hover: { scale: 1.12 },
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 120,
                      damping: 18,
                      mass: 1.1,
                    }}
                  >
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority={category.id === 1}
                    />
                  </motion.div>

                  {/* Dark overlay */}
                  <motion.div
                    className="absolute inset-0 bg-black"
                    variants={{
                      rest: { opacity: 0.4 },
                      hover: { opacity: 0.3 },
                    }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  />

                  {/* Border glow */}
                  <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    variants={{
                      rest: {
                        boxShadow: "inset 0 0 0 2px rgba(255,255,255,0)",
                      },
                      hover: {
                        boxShadow:
                          "inset 0 0 0 2px rgba(255,255,255,0.30), 0 18px 40px rgba(0,0,0,0.25)",
                      },
                    }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  />

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-between p-8">
                    {/* Title/Sub */}
                    <motion.div
                      variants={{
                        rest: { y: 0 },
                        hover: { y: -10 },
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 160,
                        damping: 20,
                        mass: 1,
                      }}
                    >
                      <h3 className="text-4xl font-bold mb-2 text-white">
                        {category.title}
                      </h3>
                      <p className="text-lg text-white/90">
                        {category.subtitle}
                      </p>
                    </motion.div>

                    {/* CTA */}
                    <motion.button
                      type="button"
                      className="flex items-center gap-2 font-bold text-sm tracking-wider text-white bg-transparent border-none cursor-pointer hover:opacity-80"
                      variants={{
                        rest: { opacity: 0, y: 18 },
                        hover: { opacity: 1, y: 0 },
                      }}
                      transition={{
                        duration: 0.35,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {category.cta || "EXPLORE"}
                      <motion.span
                        variants={{
                          rest: { x: 0 },
                          hover: { x: 6 },
                        }}
                        transition={{
                          duration: 0.25,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.span>
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CategorySection;
