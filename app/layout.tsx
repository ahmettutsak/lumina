"use client";

import "./globals.css";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import { usePathname } from "next/navigation";
import Navbar from "../components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  // Admin sayfalarında navbar'ı gösterme
  const showNavbar = !pathname?.startsWith("/admin");

  return (
    <html lang="en">
      <body className="bg-black">
        {showNavbar && <Navbar />}
        {children}
      </body>
    </html>
  );
}
