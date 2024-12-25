"use client";

import Link from "next/link";

interface Category {
  name: string;
  icon: string;
  gradient: string;
}

export default function CategoryScroll({
  categories,
}: {
  categories: Category[];
}) {
  const scrollLeft = () => {
    const container = document.querySelector(".horizontal-scroll");
    container?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    const container = document.querySelector(".horizontal-scroll");
    container?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Gradient Overlay - Left */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 dark:from-dark-200 to-transparent z-10" />

      {/* Gradient Overlay - Right */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 dark:from-dark-200 to-transparent z-10" />

      {/* Scrollable Container */}
      <div className="horizontal-scroll scroll-smooth scrollbar-hide">
        <div className="flex gap-6 pb-4 min-w-max px-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/gallery${
                category.name === "All"
                  ? ""
                  : `?category=${category.name.toLowerCase()}`
              }`}
              className="group flex flex-col items-center min-w-[200px] p-6 rounded-2xl bg-white dark:bg-dark-300/50 hover:bg-gradient-to-br hover:from-purple-500/10 hover:to-pink-500/10 transition-all duration-300 backdrop-blur-sm"
            >
              <div
                className={`w-16 h-16 rounded-full bg-gradient-to-br ${category.gradient} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                {category.icon}
              </div>
              <span className="text-lg font-medium text-gray-800 dark:text-gray-100 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">
                {category.name}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                View Collection
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Scroll Buttons */}
      <button
        onClick={scrollLeft}
        className="absolute -left-14 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white dark:bg-dark-300 shadow-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-dark-400 transition-colors"
      >
        <svg
          className="w-6 h-6 text-gray-600 dark:text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={scrollRight}
        className="absolute -right-14 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white dark:bg-dark-300 shadow-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-dark-400 transition-colors"
      >
        <svg
          className="w-6 h-6 text-gray-600 dark:text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
