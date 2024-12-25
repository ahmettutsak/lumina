"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import { supabase } from "../../lib/supabase";

export default function Profile() {
  const router = useRouter();
  const { user, checkAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setLoading(false);
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen py-16 px-4 bg-black">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-light text-white mb-2 tracking-wider">
          PROFILE
        </h1>
        <p className="text-gray-400 text-sm mb-12 tracking-wide">
          Your account details and orders
        </p>

        <div className="space-y-8">
          {/* Kullanıcı Bilgileri */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/5">
            <h2 className="text-xl font-light text-white tracking-wider mb-6">
              Account Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 font-light tracking-wide mb-1">
                  Email
                </label>
                <p className="text-white font-light tracking-wide">
                  {user.email}
                </p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 font-light tracking-wide mb-1">
                  Member Since
                </label>
                <p className="text-white font-light tracking-wide">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Çıkış Yap Butonu */}
          <button
            onClick={async () => {
              await useAuthStore.getState().signOut();
              router.push("/login");
            }}
            className="w-full py-4 bg-white/10 text-white rounded-xl font-light tracking-wider hover:bg-white/20 transition-all duration-300 border border-white/5 hover:scale-[1.02] hover:border-white/20 active:scale-[0.98]"
          >
            Sign Out
          </button>
        </div>
      </div>
    </main>
  );
}
