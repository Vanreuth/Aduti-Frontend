"use client";
import React from "react";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

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
    },
    {
      id: 3,
      title: "Accessories",
      subtitle: "New Trend",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    },
  ];

  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  return (
    <div className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="group relative h-80 rounded-xl overflow-hidden cursor-pointer shadow-lg"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                animation: `slideInUp 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${
                  index * 0.15
                }s both`,
              }}
            >
              {/* Background Image with Zoom - Framer Motion Style */}
              <div
                className="absolute inset-0 w-full h-full"
                style={{
                  transform:
                    hoveredIndex === index ? "scale(1.15)" : "scale(1)",
                  transformOrigin: "center",
                  transition:
                    "transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Overlay - Framer Motion Style Fade */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: hoveredIndex === index ? 0.3 : 0.4,
                  transition: "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  background: "rgb(0, 0, 0)",
                }}
              />

              {/* Border Glow - Framer Motion Style */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "0.75rem",
                  border: "2px solid",
                  borderColor:
                    hoveredIndex === index
                      ? "rgba(255, 255, 255, 0.3)"
                      : "rgba(255, 255, 255, 0)",
                  transition: "border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  pointerEvents: "none",
                }}
              />

              {/* Content Container */}
              <div className="relative h-full flex flex-col justify-between p-8">
                {/* Title & Subtitle - Framer Motion Style */}
                <div
                  style={{
                    transform:
                      hoveredIndex === index
                        ? "translateY(-12px)"
                        : "translateY(0)",
                    transition:
                      "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "2.25rem",
                      fontWeight: "bold",
                      marginBottom: "0.5rem",
                      color: "white",
                      transition: "color 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    {category.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "1.125rem",
                      color: "rgba(255, 255, 255, 0.9)",
                      transition: "color 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    {category.subtitle}
                  </p>
                </div>

                {/* CTA Button - Framer Motion Style */}
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontWeight: "bold",
                    fontSize: "0.875rem",
                    letterSpacing: "0.05em",
                    color: "white",
                    opacity: hoveredIndex === index ? 1 : 0,
                    transform:
                      hoveredIndex === index
                        ? "translateY(0)"
                        : "translateY(24px)",
                    transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                  className="hover:opacity-80"
                >
                  {category.cta || "EXPLORE"}
                  <ChevronRight
                    className="w-4 h-4"
                    style={{
                      transform:
                        hoveredIndex === index
                          ? "translateX(6px)"
                          : "translateX(0)",
                      transition:
                        "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .group {
            height: 300px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CategorySection;
