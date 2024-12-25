"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import { supabase } from "../../lib/supabase";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

interface Order {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  artwork: {
    title: string;
    image_url: string;
    price: number;
  };
}

export default function Profile() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchProfileAndOrders();
  }, [user]);

  const fetchProfileAndOrders = async () => {
    try {
      setLoading(true);
      // Profil bilgilerini getir
      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Siparişleri getir
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select(
          `
          *,
          artwork:artworks (
            title,
            image_url,
            price
          )
        `
        )
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (orderError) throw orderError;
      setOrders(orderData);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="bg-dark-200 rounded-xl p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {profile?.name}
              </h1>
              <p className="text-gray-400">{profile?.email}</p>
              <p className="text-sm text-gray-500 mt-2">
                Member since{" "}
                {new Date(profile?.created_at || "").toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Orders Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Your Orders</h2>
          <div className="space-y-4">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-dark-200 rounded-xl p-6 flex items-center space-x-6"
                >
                  <div className="w-24 h-24 rounded-lg overflow-hidden">
                    <img
                      src={order.artwork.image_url}
                      alt={order.artwork.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium mb-1">
                      {order.artwork.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">
                      ${order.amount.toLocaleString()}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          order.status === "completed"
                            ? "bg-green-500/10 text-green-500"
                            : order.status === "pending"
                            ? "bg-yellow-500/10 text-yellow-500"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-400">
                You haven't placed any orders yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
