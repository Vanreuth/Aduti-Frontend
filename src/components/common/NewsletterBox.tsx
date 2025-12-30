"use client";

import React from "react";

const NewsletterBox = () => {
  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="text-center">
      <p className="text-2xl font-medium text-gray-800">
        Subscribe now & Get 20% Discount
      </p>
      <p className="text-gray-400 mt-4">
        Subscribe to our newsletter to get the latest updates and offers.
      </p>

      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3"
      >
        <input
          className="w-full outline-none py-2"
          type="email"
          placeholder="Enter Email"
          required
        />
        <button
          className="bg-black text-white text-xs px-5 py-2 sm:px-10 sm:py-4"
          type="submit"
        >
          SUBSCRIBE
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;
