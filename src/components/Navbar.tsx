"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Gallery", path: "/gallery" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-transparent backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div
            className="text-white text-xl font-serif font-bold cursor-pointer tracking-wider"
            onClick={() => router.push("/")}
          >
            LUMINA
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-sm font-light tracking-wide transition-colors ${
                    isActive(item.path)
                      ? "text-purple-400"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/signup"
                className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
              >
                Login
              </Link>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-black">
            <div className="flex flex-col py-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-4 py-2 text-sm font-light tracking-wide ${
                    isActive(item.path)
                      ? "text-purple-400"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-white/10 mt-2 pt-2 px-4">
                <Link
                  href="/signup"
                  className="block px-3 py-2 text-sm font-light text-gray-300 hover:text-white"
                >
                  Sign Up
                </Link>
                <Link
                  href="/login"
                  className="block px-3 py-2 text-sm font-light text-gray-300 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  href="/profile"
                  className="block px-3 py-2 text-sm font-light text-gray-300 hover:text-white"
                >
                  Profile
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
