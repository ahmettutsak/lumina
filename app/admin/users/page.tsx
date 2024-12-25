"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  status: "active" | "inactive";
  created_at: string;
  last_login?: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, roleFilter]);

  async function fetchUsers() {
    try {
      setLoading(true);
      let query = supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      // Arama filtresi
      if (searchQuery) {
        query = query.or(
          `email.ilike.%${searchQuery}%,name.ilike.%${searchQuery}%`
        );
      }

      // Rol filtresi
      if (roleFilter) {
        query = query.eq("role", roleFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(userId: string, newStatus: User["status"]) {
    try {
      const { error } = await supabase
        .from("users")
        .update({ status: newStatus })
        .eq("id", userId);

      if (error) throw error;

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Error updating user status. Please try again.");
    }
  }

  async function handleRoleChange(userId: string, newRole: User["role"]) {
    try {
      const { error } = await supabase
        .from("users")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Error updating user role. Please try again.");
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
        <h1 className="text-3xl font-bold text-white">Users</h1>
      </div>

      {/* Filters */}
      <div className="bg-dark-200 p-4 rounded-xl mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 bg-dark-300 text-white rounded-lg border border-dark-400 focus:outline-none focus:border-purple-500"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 bg-dark-300 text-white rounded-lg border border-dark-400 focus:outline-none focus:border-purple-500"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-dark-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-dark-300">
              <th className="px-6 py-4 text-left text-gray-300 font-medium">
                User
              </th>
              <th className="px-6 py-4 text-left text-gray-300 font-medium">
                Role
              </th>
              <th className="px-6 py-4 text-left text-gray-300 font-medium">
                Status
              </th>
              <th className="px-6 py-4 text-left text-gray-300 font-medium">
                Joined
              </th>
              <th className="px-6 py-4 text-left text-gray-300 font-medium">
                Last Login
              </th>
              <th className="px-6 py-4 text-left text-gray-300 font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-300">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-dark-300/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="text-white">{user.name}</div>
                  <div className="text-sm text-gray-400">{user.email}</div>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(user.id, e.target.value as User["role"])
                    }
                    className={`px-3 py-1 rounded-lg text-sm border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      user.role === "admin"
                        ? "bg-purple-500/10 text-purple-500"
                        : "bg-blue-500/10 text-blue-500"
                    }`}
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={user.status}
                    onChange={(e) =>
                      handleStatusChange(
                        user.id,
                        e.target.value as User["status"]
                      )
                    }
                    className={`px-3 py-1 rounded-lg text-sm border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      user.status === "active"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {user.last_login
                    ? new Date(user.last_login).toLocaleDateString()
                    : "Never"}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => router.push(`/admin/users/${user.id}`)}
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
