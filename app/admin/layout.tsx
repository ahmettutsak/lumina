"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import { supabase } from "../../lib/supabase";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAuth();
  }, [user, pathname]);

  const checkAdminAuth = async () => {
    try {
      // Login sayfasındaysa ve kullanıcı zaten admin ise panele yönlendir
      if (pathname === "/admin/login") {
        if (user) {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("role")
            .eq("id", user.id)
            .single();

          if (!userError && userData?.role === "admin") {
            router.push("/admin");
            return;
          }
        }
        setLoading(false);
        return;
      }

      // Kullanıcı yoksa login'e yönlendir
      if (!user) {
        router.push("/admin/login");
        return;
      }

      // Kullanıcının admin olup olmadığını kontrol et
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (userError || userData?.role !== "admin") {
        // Admin değilse çıkış yap ve login'e yönlendir
        await supabase.auth.signOut();
        router.push("/admin/login");
        return;
      }

      setLoading(false);
    } catch (error) {
      console.error("Admin auth check error:", error);
      router.push("/admin/login");
    }
  };

  if (loading && pathname !== "/admin/login") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Login sayfasında sidebar'ı gösterme
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-dark-100">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-dark-100 flex">
      <AdminSidebar />
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
