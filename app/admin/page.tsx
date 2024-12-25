"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

interface DashboardStats {
  totalArtworks: number;
  totalSales: number;
  activeUsers: number;
  pendingOrders: number;
  recentActivities: any[];
}

interface RecentActivity {
  id: string;
  description: string;
  date: Date;
  status: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalArtworks: 0,
    totalSales: 0,
    activeUsers: 0,
    pendingOrders: 0,
    recentActivities: [],
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);

        // Total Sales - Sadece completed orderların toplamını al
        const { data: salesData, error: salesError } = await supabase
          .from("orders")
          .select("amount")
          .eq("status", "completed");

        if (salesError) throw salesError;

        const totalSales =
          salesData?.reduce((sum, order) => sum + (order.amount || 0), 0) || 0;

        // Total Artworks
        const { count: artworksCount, error: artworksError } = await supabase
          .from("artworks")
          .select("*", { count: "exact" });

        if (artworksError) throw artworksError;

        // Active Users
        const { count: usersCount, error: usersError } = await supabase
          .from("users")
          .select("*", { count: "exact" })
          .eq("status", "active");

        if (usersError) throw usersError;

        // Pending Orders
        const { count: pendingOrdersCount, error: ordersError } = await supabase
          .from("orders")
          .select("*", { count: "exact" })
          .eq("status", "pending");

        if (ordersError) throw ordersError;

        // Recent Activities - Son 5 siparişi getir
        const { data: recentOrders, error: recentError } = await supabase
          .from("orders")
          .select(
            `
            *,
            artwork:artworks(title),
            user:users(name)
          `
          )
          .order("created_at", { ascending: false })
          .limit(5);

        if (recentError) throw recentError;

        setStats({
          totalSales,
          totalArtworks: artworksCount || 0,
          activeUsers: usersCount || 0,
          pendingOrders: pendingOrdersCount || 0,
          recentActivities: recentOrders || [],
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-dark-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Sales</p>
              <p className="text-2xl font-bold text-white mt-1">
                ${stats.totalSales.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-500/10 p-3 rounded-lg">
              <svg
                className="w-6 h-6 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-dark-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Users</p>
              <p className="text-2xl font-bold text-white mt-1">
                {stats.activeUsers}
              </p>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-500"
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
            </div>
          </div>
        </div>

        <div className="bg-dark-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Artworks</p>
              <p className="text-2xl font-bold text-white mt-1">
                {stats.totalArtworks}
              </p>
            </div>
            <div className="bg-purple-500/10 p-3 rounded-lg">
              <svg
                className="w-6 h-6 text-purple-500"
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
            </div>
          </div>
        </div>

        <div className="bg-dark-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending Orders</p>
              <p className="text-2xl font-bold text-white mt-1">
                {stats.pendingOrders}
              </p>
            </div>
            <div className="bg-yellow-500/10 p-3 rounded-lg">
              <svg
                className="w-6 h-6 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-dark-200 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Recent Activities
        </h2>
        <div className="space-y-4">
          {stats.recentActivities.length > 0 ? (
            stats.recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between py-3 border-b border-dark-300 last:border-0"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-500/10 p-2 rounded-lg">
                    <svg
                      className="w-6 h-6 text-purple-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white">
                      {activity.user?.name || "Unknown User"} ordered{" "}
                      {activity.artwork?.title || "Untitled Artwork"}
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="text-white font-medium">
                  ${activity.amount?.toLocaleString()}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-4">
              No recent activities
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
