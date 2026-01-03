"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { staggerContainer, fadeUpItem } from "@/lib/utils";

const policyData = [
  {
    icon: "/exchange_icon.png",
    title: "Easy Exchange Policy",
    desc: "We offer hassle-free exchange policy",
  },
  {
    icon: "/quality_icon.png",
    title: "7 Days Return Policy",
    desc: "We provide 7 days free return policy",
  },
  {
    icon: "/support_img.png",
    title: "Best Customer Support",
    desc: "We provide 24/7 customer support",
  },
];

const OurPolicy = () => {
  return (
    <div className="container-app">
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="flex flex-col sm:flex-row justify-around gap-12 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700"
      >
        {policyData.map((item, index) => (
          <motion.div
            key={index}
            variants={fadeUpItem}
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
          >
            <Image
              src={item.icon}
              width={48}
              height={48}
              className="w-12 m-auto mb-5 object-contain"
              alt={item.title}
            />
            <p className="font-semibold">{item.title}</p>
            <p className="text-gray-500 mt-1">{item.desc}</p>
          </motion.div>
        ))}
      </motion.section>
    </div>
  );
};

export default OurPolicy;
