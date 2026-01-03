"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUpItem } from "@/lib/utils";

export default function NewsletterBox() {
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    // 🔌 Hook your API here
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <section className="container-app">
      <motion.div
        variants={fadeUpItem}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        className="mx-auto max-w-3xl text-center py-12 sm:py-16 px-4"
      >
        {/* Heading */}
        <h2 className="text-xl sm:text-3xl font-semibold text-zinc-900 leading-tight">
          Subscribe now & get <span className="text-primary">20% off</span>
        </h2>

        <p className="mt-3 text-sm sm:text-base text-zinc-500">
          Join our newsletter for exclusive deals, product updates, and early
          access.
        </p>

        {/* Form */}
        <form
          onSubmit={onSubmitHandler}
          className="
            mt-6 sm:mt-8
            flex flex-col sm:flex-row
            items-stretch sm:items-center
            gap-3
            bg-white border rounded-2xl sm:rounded-full
            p-2
            shadow-sm
          "
        >
          <label htmlFor="email" className="sr-only">
            Email address
          </label>

          <input
            id="email"
            type="email"
            required
            placeholder="Enter your email address"
            className="
              min-w-0 flex-1 w-full
              px-4 py-3
              text-sm sm:text-base
              bg-transparent
              outline-none
             sm:rounded-full
              border border-transparent

               focus:ring-zinc-900/20
            "
          />

          <button
            type="submit"
            disabled={loading}
            className="
              w-full sm:w-auto
              rounded-xl sm:rounded-full
              bg-zinc-900
              px-6 py-3
              text-sm font-medium text-white
              transition
              hover:bg-zinc-800
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {loading ? "SUBSCRIBING..." : "SUBSCRIBE"}
          </button>
        </form>
      </motion.div>
    </section>
  );
}
