"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Kullanıcı profilini oluştur
        const { error: profileError } = await supabase
          .from("users")
          .insert([{ id: authData.user.id, email }]);

        if (profileError) throw profileError;
      }

      router.push("/");
      router.refresh();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Begin Your Journey</h2>
          <p className="mt-2 text-gray-400">Discover the Art of Tomorrow</p>
        </div>

        <form onSubmit={handleSignup} className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-500/10 text-red-500 p-4 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm text-gray-300">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2 bg-black border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-gray-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 bg-black border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-sm text-gray-400 hover:text-white"
            >
              Already have an account? Sign in
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
