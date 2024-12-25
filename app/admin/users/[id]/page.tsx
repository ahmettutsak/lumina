"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  status: "active" | "inactive";
  created_at: string;
  last_login?: string;
}

interface Order {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  artwork: {
    title: string;
    price: number;
  }[];
}

export default function UserDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, [params.id]);

  async function fetchUserDetails() {
    try {
      setLoading(true);
      // Kullanıcı bilgilerini al
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select(
          `
          id,
          email,
          name,
          role,
          status,
          created_at,
          last_login,
          orders (
            id,
            amount,
            status,
            created_at,
            artworks (
              title,
              price
            )
          )
        `
        )
        .eq("id", params.id)
        .single();

      if (userError) throw userError;

      setUser(userData);

      // Kullanıcının siparişlerini al
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select(
          `
          id,
          amount,
          status,
          created_at,
          artwork:artworks!inner (
            title,
            price
          )
        `
        )
        .eq("user_id", params.id)
        .order("created_at", { ascending: false });

      if (orderError) throw orderError;

      setOrders(orderData || []);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-white">User not found</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">User Details</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 text-gray-300 hover:text-white transition-colors flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>
      </div>

      {/* User Info */}
      <div className="bg-dark-200 p-6 rounded-xl mb-8">
        <h2 className="text-xl font-semibold text-white mb-6">
          Basic Information
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-gray-400 mb-1">Name</div>
            <div className="text-white">{user.name}</div>
          </div>
          <div>
            <div className="text-gray-400 mb-1">Email</div>
            <div className="text-white">{user.email}</div>
          </div>
          <div>
            <div className="text-gray-400 mb-1">Role</div>
            <div
              className={`inline-block px-3 py-1 rounded-lg text-sm ${
                user.role === "admin"
                  ? "bg-purple-500/10 text-purple-500"
                  : "bg-blue-500/10 text-blue-500"
              }`}
            >
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </div>
          </div>
          <div>
            <div className="text-gray-400 mb-1">Status</div>
            <div
              className={`inline-block px-3 py-1 rounded-lg text-sm ${
                user.status === "active"
                  ? "bg-green-500/10 text-green-500"
                  : "bg-red-500/10 text-red-500"
              }`}
            >
              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </div>
          </div>
          <div>
            <div className="text-gray-400 mb-1">Join Date</div>
            <div className="text-white">
              {new Date(user.created_at).toLocaleDateString()}
            </div>
          </div>
          <div>
            <div className="text-gray-400 mb-1">Last Login</div>
            <div className="text-white">
              {user.last_login
                ? new Date(user.last_login).toLocaleDateString()
                : "Never"}
            </div>
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="bg-dark-200 p-6 rounded-xl">
        <h2 className="text-xl font-semibold text-white mb-6">Order History</h2>
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm">
                  <th className="pb-4">Order ID</th>
                  <th className="pb-4">Artwork</th>
                  <th className="pb-4">Amount</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-300">
                {orders.map((order) => (
                  <tr key={order.id} className="text-white">
                    <td className="py-4">#{order.id.slice(-6)}</td>

                    <td className="py-4">${order.amount}</td>
                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-lg text-sm ${
                          order.status === "completed"
                            ? "bg-green-500/10 text-green-500"
                            : order.status === "cancelled"
                            ? "bg-red-500/10 text-red-500"
                            : "bg-yellow-500/10 text-yellow-500"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-gray-400 text-center py-8">
            No orders found for this user
          </div>
        )}
      </div>
    </div>
  );
}
