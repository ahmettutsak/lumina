"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { useAuthStore } from "../../store/authStore";
import Image from "next/image";

interface Artwork {
  id: string;
  title: string;
  price: number;
  image_url: string;
  artist: string;
}

interface Props {
  artworkId: string;
}

export default function CheckoutForm({ artworkId }: Props) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sabit demo değerleri
  const DEMO_CARD = {
    number: "1111 1111 1111 1111",
    name: "NAME SURNAME",
    expiry: "01/28",
    cvv: "999",
  };

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchArtwork();
  }, []);

  const fetchArtwork = async () => {
    try {
      const { data, error } = await supabase
        .from("artworks")
        .select("*")
        .eq("id", artworkId)
        .single();

      if (error) throw error;
      setArtwork(data);
    } catch (error) {
      console.error("Error fetching artwork:", error);
      setError("Artwork not found");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !artwork) return;

    try {
      setProcessing(true);
      setError(null);

      // Demo için 2 saniyelik gecikme
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Sipariş oluştur
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: user.id,
            artwork_id: artwork.id,
            amount: artwork.price,
            status: "pending",
            payment_method: "credit_card", // Demo için sabit değer
            transaction_id: `DEMO_${Date.now()}`, // Demo için unique bir değer
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // Başarılı ödeme sonrası profile yönlendir
      router.push("/profile");
    } catch (error: any) {
      console.error("Error processing payment:", error);
      setError("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500">{error || "Artwork not found"}</div>
        <button
          onClick={() => router.back()}
          className="mt-4 text-gray-400 hover:text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-16 px-4 bg-black">
      <div className="max-w-5xl mx-auto">
        <div className="relative">
          <h1 className="text-4xl font-light text-white mb-2 tracking-wider">
            CHECKOUT
          </h1>
          <p className="text-gray-400 text-sm mb-12 tracking-wide">
            Complete your artwork purchase
          </p>

          <div className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-2xl p-4 mb-12">
            <p className="text-white/60 text-sm font-light tracking-wide">
              ✨ This is an artistic demo for portfolio showcase. No actual
              payments are processed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Artwork Preview */}
            <div className="space-y-8">
              <div className="aspect-square rounded-2xl overflow-hidden relative group">
                <Image
                  src={artwork.image_url}
                  alt={artwork.title}
                  width={800}
                  height={800}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-light text-white tracking-wide">
                  {artwork.title}
                </h2>
                <p className="text-gray-400 font-light tracking-wide">
                  by {artwork.artist}
                </p>
                <div className="pt-4 flex justify-between items-baseline border-t border-white/5">
                  <span className="text-gray-400 font-light tracking-wide">
                    Price
                  </span>
                  <span className="text-3xl font-light text-white tracking-wider">
                    ${artwork.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="space-y-8">
              <form onSubmit={handleSubmit}>
                <div className="space-y-8">
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 space-y-6 border border-white/5">
                    <h3 className="text-xl font-light text-white tracking-wider mb-6">
                      Payment Details
                    </h3>

                    {/* Card Number */}
                    <div className="space-y-2">
                      <label className="block text-sm text-gray-400 font-light tracking-wide">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={DEMO_CARD.number}
                        readOnly
                        className="w-full px-4 py-3 bg-white/5 text-white rounded-xl border border-white/5 focus:outline-none cursor-not-allowed font-light tracking-widest"
                      />
                    </div>

                    {/* Card Name */}
                    <div className="space-y-2">
                      <label className="block text-sm text-gray-400 font-light tracking-wide">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={DEMO_CARD.name}
                        readOnly
                        className="w-full px-4 py-3 bg-white/5 text-white rounded-xl border border-white/5 focus:outline-none cursor-not-allowed font-light tracking-widest"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Expiry Date */}
                      <div className="space-y-2">
                        <label className="block text-sm text-gray-400 font-light tracking-wide">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={DEMO_CARD.expiry}
                          readOnly
                          className="w-full px-4 py-3 bg-white/5 text-white rounded-xl border border-white/5 focus:outline-none cursor-not-allowed font-light tracking-widest"
                        />
                      </div>

                      {/* CVV */}
                      <div className="space-y-2">
                        <label className="block text-sm text-gray-400 font-light tracking-wide">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={DEMO_CARD.cvv}
                          readOnly
                          className="w-full px-4 py-3 bg-white/5 text-white rounded-xl border border-white/5 focus:outline-none cursor-not-allowed font-light tracking-widest"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-24 space-y-8">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/5">
                      <div className="flex justify-between items-baseline mb-8">
                        <span className="text-gray-400 font-light tracking-wide">
                          Total Amount
                        </span>
                        <span className="text-3xl font-light text-white tracking-wider">
                          ${artwork.price.toLocaleString()}
                        </span>
                      </div>

                      {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm mb-6 font-light">
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-4 bg-white/10 text-white rounded-xl font-light tracking-wider hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 border border-white/5 hover:scale-[1.02] hover:border-white/20 active:scale-[0.98]"
                      >
                        {processing ? (
                          <>
                            <svg
                              className="animate-spin h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            <span>Processing...</span>
                          </>
                        ) : (
                          <span>Complete Purchase</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
