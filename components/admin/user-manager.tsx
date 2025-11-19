"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Shield, UserCheck, Calendar, Crown, Mail, Clock } from "lucide-react";

export default function UserManager() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setUsers(data || []);
      } catch (error) {
        console.error("[SFF] Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name || ""} ${user.last_name || ""}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return (
      user.email?.toLowerCase().includes(query) ||
      fullName.includes(query) ||
      user.first_name?.toLowerCase().includes(query) ||
      user.last_name?.toLowerCase().includes(query)
    );
  });

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const studentCount = totalUsers - adminCount;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-2xl font-bold text-[#0C1E46] animate-pulse">Loading community...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 font-Coolvetica px-4 py-8">

      {/* HERO HEADER — Compact & Powerful */}
      <div className="text-center">
        <div className="inline-block bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white px-8 py-8 rounded-2xl shadow-xl">
          <Users className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4" />
          <h2 className="text-3xl md:text-5xl font-bold">User Management</h2>
          <p className="text-blue-100 text-base md:text-xl mt-3 max-w-2xl mx-auto">
            Full control over every member of the SFF family
          </p>
        </div>
      </div>

      {/* STATS GRID — Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[#0C1E46] to-[#0a1838] text-white rounded-2xl p-6 shadow-lg">
          <Users className="w-10 h-10 mb-3" />
          <p className="text-4xl md:text-5xl font-bold">{totalUsers.toLocaleString()}</p>
          <p className="text-blue-100 text-sm md:text-base mt-2">Total Users</p>
        </div>

        <div className="bg-gradient-to-br from-[#ED4137] to-red-600 text-white rounded-2xl p-6 shadow-lg">
          <UserCheck className="w-10 h-10 mb-3" />
          <p className="text-4xl md:text-5xl font-bold">{studentCount.toLocaleString()}</p>
          <p className="text-red-100 text-sm md:text-base mt-2">Students Learning</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-2xl p-6 shadow-lg">
          <Shield className="w-10 h-10 mb-3" />
          <p className="text-4xl md:text-5xl font-bold">{adminCount}</p>
          <p className="text-purple-100 text-sm md:text-base mt-2">Admins Active</p>
        </div>
      </div>

      {/* SEARCH BAR — Mobile-First */}
      <div className="max-w-2xl mx-auto relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#0C1E46]" />
        <Input
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-14 h-14 text-lg border-2 rounded-xl shadow-md focus:border-[#ED4137]"
        />
      </div>

      {/* USER LIST — Mobile Cards + Desktop Table */}
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-[#0C1E46] to-[#0a1838] px-6 py-5">
          <h3 className="text-2xl md:text-3xl font-bold text-white">
            All Users ({filteredUsers.length})
          </h3>
          <p className="text-blue-100 text-sm md:text-base mt-1">
            {searchQuery ? `Found ${filteredUsers.length} result(s)` : "Every member of SFF"}
          </p>
        </div>

        {/* Mobile: Card List */}
        <div className="md:hidden divide-y divide-gray-200">
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-lg">No users found</div>
          ) : (
            filteredUsers.map((user) => {
              const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Unnamed";
              const joined = new Date(user.created_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              return (
                <div key={user.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-[#ED4137] to-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-lg text-[#0C1E46]">{fullName}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <Badge
                      className={`font-bold ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role === "admin" ? (
                        <>
                          <Crown className="w-4 h-4 mr-1" /> Admin
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-4 h-4 mr-1" /> Student
                        </>
                      )}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Joined {joined}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#0C1E46] text-[#0C1E46] hover:bg-[#0C1E46] hover:text-white font-bold"
                    >
                      View
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop: Full Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#B0CCFE]/20">
                <th className="text-left p-6 font-bold text-[#0C1E46]">Name</th>
                <th className="text-left p-6 font-bold text-[#0C1E46]">Email</th>
                <th className="text-left p-6 font-bold text-[#0C1E46]">Role</th>
                <th className="text-left p-6 font-bold text-[#0C1E46]">Joined</th>
                <th className="text-left p-6 font-bold text-[#0C1E46]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-xl text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Unnamed";
                  const joined = new Date(user.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  });

                  return (
                    <tr key={user.id} className="border-b hover:bg-[#B0CCFE]/5 transition">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#ED4137] to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                            {fullName.charAt(0)}
                          </div>
                          <p className="font-bold text-lg">{fullName}</p>
                        </div>
                      </td>
                      <td className="p-6 text-gray-700">{user.email}</td>
                      <td className="p-6">
                        <Badge
                          className={`font-bold ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.role === "admin" ? (
                            <>
                              <Crown className="w-4 h-4 mr-1" /> Admin
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-4 h-4 mr-1" /> Student
                            </>
                          )}
                        </Badge>
                      </td>
                      <td className="p-6 text-gray-600">
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4" /> {joined}
                        </span>
                      </td>
                      <td className="p-6">
                        <Button
                          variant="outline"
                          className="border-[#0C1E46] text-[#0C1E46] hover:bg-[#0C1E46] hover:text-white font-bold"
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FINAL MOTIVATION */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-[#ED4137] via-orange-600 to-red-700 text-white py-12 px-8 rounded-2xl shadow-2xl">
          <p className="text-3xl md:text-5xl font-bold">
            {totalUsers.toLocaleString()} people
          </p>
          <p className="text-3xl md:text-5xl font-bold mt-4">
            believe in the SFF mission
          </p>
          <p className="text-xl md:text-2xl mt-6 opacity-90">
            From Lagos to Paris — one account at a time
          </p>
        </div>
      </div>
    </div>
  );
}