"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

// UUID formatı için regex
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface ShippingAddress {
  street?: string;
  city?: string;
  country?: string;
  postal_code?: string;
}

interface Order {
  id: string;
  created_at: string;
  updated_at: string;
  status: "pending" | "completed" | "cancelled";
  amount: number;
  payment_method: string | null;
  transaction_id: string | null;
  shipping_address: ShippingAddress | null;
  user_id: string;
  artwork_id: string;
  user: {
    id: string;
    email: string;
  };
  artwork: {
    id: string;
    title: string;
    image_url: string;
    price: number;
    artist: string;
  };
}

export default function OrderDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ID formatını kontrol et
    if (!params.id || !UUID_REGEX.test(params.id)) {
      setError("Invalid order ID format");
      setLoading(false);
      return;
    }

    fetchOrder();
  }, [params.id]);

  const fetchOrder = async () => {
    try {
      setError(null);

      // İlk olarak siparişi getir
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select(
          `
          id,
          created_at,
          updated_at,
          status,
          amount,
          payment_method,
          transaction_id,
          shipping_address,
          user_id,
          artwork_id
        `
        )
        .eq("id", params.id)
        .single();

      if (orderError) {
        console.error("Order fetch error:", orderError);
        throw new Error("Order not found");
      }

      if (!orderData) {
        throw new Error("Order not found");
      }

      // Kullanıcı bilgilerini getir
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, email")
        .eq("id", orderData.user_id)
        .single();

      if (userError) {
        console.error("User fetch error:", userError);
        throw new Error("User information not found");
      }

      // Eser bilgilerini getir
      const { data: artworkData, error: artworkError } = await supabase
        .from("artworks")
        .select("id, title, image_url, price, artist")
        .eq("id", orderData.artwork_id)
        .single();

      if (artworkError) {
        console.error("Artwork fetch error:", artworkError);
        throw new Error("Artwork information not found");
      }

      // Tüm verileri birleştir
      const completeOrder: Order = {
        ...orderData,
        user: userData,
        artwork: artworkData,
      };

      setOrder(completeOrder);
    } catch (error: any) {
      console.error("Error fetching order:", error);
      setError(error.message || "An error occurred while fetching the order");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    try {
      setUpdating(true);
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", params.id);

      if (error) throw error;

      // Siparişi yeniden yükle
      await fetchOrder();
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="text-red-500">{error}</div>
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="text-white">Order not found</div>
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Order Details</h1>
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white"
        >
          Back to Orders
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Artwork Details */}
        <div className="bg-dark-200 rounded-xl p-6">
          <div className="aspect-square rounded-lg overflow-hidden mb-6">
            <img
              src={order.artwork.image_url}
              alt={order.artwork.title}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            {order.artwork.title}
          </h2>
          <p className="text-gray-400 mb-4">by {order.artwork.artist}</p>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Price</span>
            <span className="text-white font-medium">
              ${order.artwork.price.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Order Details */}
        <div className="space-y-6">
          <div className="bg-dark-200 rounded-xl p-6">
            <h3 className="text-lg font-medium text-white mb-4">Order Info</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Order ID</span>
                <span className="text-white font-mono">{order.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Created Date</span>
                <span className="text-white">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Last Updated</span>
                <span className="text-white">
                  {new Date(order.updated_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Amount</span>
                <span className="text-white font-medium">
                  ${order.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Payment Method</span>
                <span className="text-white">
                  {order.payment_method || "Not specified"}
                </span>
              </div>
              {order.transaction_id && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Transaction ID</span>
                  <span className="text-white font-mono">
                    {order.transaction_id}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Status</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    order.status === "completed"
                      ? "bg-green-500/10 text-green-500"
                      : order.status === "pending"
                      ? "bg-yellow-500/10 text-yellow-500"
                      : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-dark-200 rounded-xl p-6">
            <h3 className="text-lg font-medium text-white mb-4">
              Customer Info
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Email</span>
                <span className="text-white">{order.user.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">User ID</span>
                <span className="text-white font-mono">{order.user.id}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shipping_address && (
            <div className="bg-dark-200 rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-4">
                Shipping Address
              </h3>
              <div className="space-y-2">
                {order.shipping_address.street && (
                  <p className="text-white">{order.shipping_address.street}</p>
                )}
                {order.shipping_address.city &&
                  order.shipping_address.postal_code && (
                    <p className="text-white">
                      {order.shipping_address.city},{" "}
                      {order.shipping_address.postal_code}
                    </p>
                  )}
                {order.shipping_address.country && (
                  <p className="text-white">{order.shipping_address.country}</p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="bg-dark-200 rounded-xl p-6">
            <h3 className="text-lg font-medium text-white mb-4">Actions</h3>
            <div className="flex gap-4">
              <button
                onClick={() => updateOrderStatus("completed")}
                disabled={updating || order.status === "completed"}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mark as Completed
              </button>
              <button
                onClick={() => updateOrderStatus("cancelled")}
                disabled={updating || order.status === "cancelled"}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
