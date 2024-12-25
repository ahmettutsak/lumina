"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import { useAuthStore } from "../../../store/authStore";

interface Order {
  id: string;
  user_id: string;
  artwork_id: string;
  amount: number;
  status: string;
  payment_method: string;
  transaction_id: string;
  created_at: string;
}

interface OrderDetails extends Order {
  user: {
    email: string;
  };
  artwork: {
    title: string;
    image_url: string;
    price: number;
  };
}

export default function OrderDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/admin/login");
      return;
    }
    fetchOrder();
  }, [user, params.id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select(
          `
          *,
          user:users (email),
          artwork:artworks (title, image_url, price)
        `
        )
        .eq("id", params.id)
        .single();

      if (orderError) throw orderError;
      if (orderData) {
        setOrder(orderData as OrderDetails);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching order:", error.message);
        setError("Error fetching order details");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const { error: updateError } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", params.id);

      if (updateError) throw updateError;

      // Siparişi yeniden yükle
      fetchOrder();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error updating order status:", error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">{error || "Order not found"}</div>
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-16 px-4 bg-black">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-light text-white tracking-wider">
            ORDER DETAILS
          </h1>
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Back to Orders
          </button>
        </div>

        <div className="space-y-8">
          {/* Order Info */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/5">
            <h2 className="text-xl font-light text-white tracking-wider mb-6">
              Order Information
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 font-light tracking-wide mb-1">
                  Order ID
                </label>
                <p className="text-white font-light tracking-wide">
                  {order.id}
                </p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 font-light tracking-wide mb-1">
                  Date
                </label>
                <p className="text-white font-light tracking-wide">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 font-light tracking-wide mb-1">
                  Amount
                </label>
                <p className="text-white font-light tracking-wide">
                  ${order.amount.toLocaleString()}
                </p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 font-light tracking-wide mb-1">
                  Status
                </label>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="bg-white/5 text-white px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-white/20"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/5">
            <h2 className="text-xl font-light text-white tracking-wider mb-6">
              Customer Information
            </h2>
            <div>
              <label className="block text-sm text-gray-400 font-light tracking-wide mb-1">
                Email
              </label>
              <p className="text-white font-light tracking-wide">
                {order.user.email}
              </p>
            </div>
          </div>

          {/* Artwork Info */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/5">
            <h2 className="text-xl font-light text-white tracking-wider mb-6">
              Artwork Information
            </h2>
            <div className="flex space-x-6">
              <div className="w-32 h-32 rounded-lg overflow-hidden">
                <img
                  src={order.artwork.image_url}
                  alt={order.artwork.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-white font-light mb-2">
                  {order.artwork.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  ${order.artwork.price.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/5">
            <h2 className="text-xl font-light text-white tracking-wider mb-6">
              Payment Information
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 font-light tracking-wide mb-1">
                  Payment Method
                </label>
                <p className="text-white font-light tracking-wide">
                  {order.payment_method}
                </p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 font-light tracking-wide mb-1">
                  Transaction ID
                </label>
                <p className="text-white font-light tracking-wide">
                  {order.transaction_id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
