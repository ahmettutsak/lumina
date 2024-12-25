"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import { supabase } from "../../lib/supabase";

export default function AdminSidebar() {
  const pathname = usePathname();
  const signOut = useAuthStore((state) => state.signOut);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    signOut();
  };

  return (
    <div className="w-64 bg-dark-200 min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link
              href="/admin"
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                pathname === "/admin"
                  ? "bg-purple-600 text-white"
                  : "text-gray-300 hover:bg-dark-300"
              }`}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/admin/artworks"
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                pathname.startsWith("/admin/artworks")
                  ? "bg-purple-600 text-white"
                  : "text-gray-300 hover:bg-dark-300"
              }`}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Artworks
            </Link>
          </li>
          <li>
            <Link
              href="/admin/orders"
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                pathname.startsWith("/admin/orders")
                  ? "bg-purple-600 text-white"
                  : "text-gray-300 hover:bg-dark-300"
              }`}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              Orders
            </Link>
          </li>
          <li>
            <Link
              href="/admin/users"
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                pathname.startsWith("/admin/users")
                  ? "bg-purple-600 text-white"
                  : "text-gray-300 hover:bg-dark-300"
              }`}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              Users
            </Link>
          </li>
        </ul>
      </nav>

      <div className="border-t border-dark-300 pt-4">
        <button
          onClick={handleSignOut}
          className="flex items-center px-4 py-2 text-gray-300 hover:bg-dark-300 rounded-lg transition-colors w-full"
        >
          <svg
            className="w-5 h-5 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}
