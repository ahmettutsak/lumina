"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

interface Order {
  id: string;
  artwork: {
    id: string;
    title: string;
    price: number;
    image_url: string | null;
  } | null;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  amount: number;
  status: "pending" | "completed" | "cancelled";
  payment_method: string;
  transaction_id: string;
  shipping_address: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  created_at: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [searchQuery, statusFilter]);

  async function fetchOrders() {
    try {
      setLoading(true);
      let query = supabase
        .from("orders")
        .select(
          `
          *,
          artwork:artworks (
            id,
            title,
            price,
            image_url
          ),
          user:users (
            id,
            name,
            email
          )
        `
        )
        .order("created_at", { ascending: false });

      // Arama filtresi
      if (searchQuery) {
        query = query.or(
          `artwork.title.ilike.%${searchQuery}%,user.name.ilike.%${searchQuery}%,user.email.ilike.%${searchQuery}%`
        );
      }

      // Durum filtresi
      if (statusFilter) {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(
    orderId: string,
    newStatus: Order["status"]
  ) {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      // Listeyi güncelle
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Error updating order status. Please try again.");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Orders</h1>
      </div>

      {/* Filters */}
      <div className="bg-dark-200 p-4 rounded-xl mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by artwork, customer name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 bg-dark-300 text-white rounded-lg border border-dark-400 focus:outline-none focus:border-purple-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-dark-300 text-white rounded-lg border border-dark-400 focus:outline-none focus:border-purple-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-dark-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-dark-300">
              <th className="px-6 py-4 text-left text-gray-300 font-medium">
                Order ID
              </th>
              <th className="px-6 py-4 text-left text-gray-300 font-medium">
                Artwork
              </th>
              <th className="px-6 py-4 text-left text-gray-300 font-medium">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-gray-300 font-medium">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-gray-300 font-medium">
                Status
              </th>
              <th className="px-6 py-4 text-left text-gray-300 font-medium">
                Date
              </th>
              <th className="px-6 py-4 text-left text-gray-300 font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-300">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-dark-300/50 transition-colors"
              >
                <td className="px-6 py-4 text-gray-300">
                  #{order.id.slice(-6)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={order.artwork?.image_url || "/placeholder-image.jpg"}
                      alt={order.artwork?.title || "Artwork"}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <div className="text-white">
                        {order.artwork?.title || "Unknown Artwork"}
                      </div>
                      <div className="text-sm text-gray-400">
                        ${order.artwork?.price?.toLocaleString() || "0"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-white">
                    {order.user?.name || "Unknown User"}
                  </div>
                  <div className="text-sm text-gray-400">
                    {order.user?.email || "No email"}
                  </div>
                </td>
                <td className="px-6 py-4 text-white">
                  ${order.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(
                        order.id,
                        e.target.value as Order["status"]
                      )
                    }
                    className={`px-3 py-1 rounded-lg text-sm border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      order.status === "completed"
                        ? "bg-green-500/10 text-green-500"
                        : order.status === "cancelled"
                        ? "bg-red-500/10 text-red-500"
                        : "bg-yellow-500/10 text-yellow-500"
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => router.push(`/admin/orders/${order.id}`)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
