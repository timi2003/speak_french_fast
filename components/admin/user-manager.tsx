"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Search,
  Shield,
  UserCheck,
  Calendar,
  Crown,
  Mail,
  Clock,
} from "lucide-react";

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

  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === "admin").length;
  const studentCount = totalUsers - adminCount;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-3xl text-gray-600 font-Coolvetica">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-12 font-Coolvetica">
      {/* Hero Header */}
      <div className="text-center">
        <div className="inline-flex flex-col items-center gap-6 bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white px-12 py-10 rounded-3xl shadow-2xl">
          <Users className="w-20 h-20" />
          <div>
            <h2 className="text-5xl md:text-7xl font-bold">User Management</h2>
            <p className="text-blue-100 text-2xl mt-4">
              Full control over every member of the SFF Academy family
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <Card className="bg-gradient-to-br from-[#0C1E46] to-[#0a1838] text-white shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl flex items-center gap-4">
              <Users className="w-10 h-10" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-7xl font-bold">{totalUsers.toLocaleString()}</p>
            <p className="text-blue-100 mt-3">Growing every day</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#ED4137] to-red-600 text-white shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl flex items-center gap-4">
              <UserCheck className="w-10 h-10" />
              Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-7xl font-bold">{studentCount.toLocaleString()}</p>
            <p className="text-red-100 mt-3">Learning French with SFF</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl flex items-center gap-4">
              <Shield className="w-10 h-10" />
              Admins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-7xl font-bold">{adminCount}</p>
            <p className="text-purple-100 mt-3">Managing the platform</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-3xl mx-auto">
        <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-10 h-10 text-[#0C1E46]" />
        <Input
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-24 h-24 text-3xl border-4 border-[#0C1E46] rounded-3xl shadow-2xl focus:border-[#ED4137] transition-all"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-[#0C1E46] to-[#0a1838] px-10 py-8">
          <h3 className="text-4xl md:text-5xl font-bold text-white">
            All Users ({filteredUsers.length})
          </h3>
          <p className="text-blue-100 text-xl mt-3">
            {searchQuery ? `Found ${filteredUsers.length} user(s)` : "Every member of the SFF community"}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#B0CCFE]/30 border-b-2 border-[#B0CCFE]">
                <th className="text-left py-6 px-8 font-bold text-[#0C1E46] text-xl">
                  Name
                </th>
                <th className="text-left py-6 px-8 font-bold text-[#0C1E46] text-xl">
                  <Mail className="w-6 h-6 inline mr-2" />
                  Email
                </th>
                <th className="text-left py-6 px-8 font-bold text-[#0C1E46] text-xl">
                  <Shield className="w-6 h-6 inline mr-2" />
                  Role
                </th>
                <th className="text-left py-6 px-8 font-bold text-[#0C1E46] text-xl">
                  <Calendar className="w-6 h-6 inline mr-2" />
                  Joined
                </th>
                <th className="text-left py-6 px-8 font-bold text-[#0C1E46] text-xl">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-20 text-2xl text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Unnamed User";
                  const joinedDate = new Date(user.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  });

                  return (
                    <tr
                      key={user.id}
                      className="border-b hover:bg-[#B0CCFE]/10 transition-all"
                    >
                      <td className="py-6 px-8">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-[#ED4137] to-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                            {fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-xl text-[#0C1E46]">{fullName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-8 text-gray-700 text-lg">{user.email}</td>
                      <td className="py-6 px-8">
                        <Badge
                          variant="outline"
                          className={`text-lg font-bold px-5 py-2 ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800 border-purple-300"
                              : "bg-green-100 text-green-800 border-green-300"
                          }`}
                        >
                          {user.role === "admin" ? (
                            <>
                              <Crown className="w-5 h-5 mr-2" />
                              Admin
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-5 h-5 mr-2" />
                              Student
                            </>
                          )}
                        </Badge>
                      </td>
                      <td className="py-6 px-8 text-gray-600 font-medium text-lg">
                        <Clock className="w-5 h-5 inline mr-2" />
                        {joinedDate}
                      </td>
                      <td className="py-6 px-8">
                        <Button
                          variant="outline"
                          size="lg"
                          className="border-2 border-[#0C1E46] text-[#0C1E46] hover:bg-[#0C1E46] hover:text-white font-bold text-lg px-8 h-14"
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

      {/* Final Motivation */}
      <div className="text-center bg-gradient-to-r from-[#ED4137] to-red-600 text-white py-16 px-10 rounded-3xl shadow-2xl">
        <p className="text-4xl md:text-6xl font-bold">
          {totalUsers.toLocaleString()} people
        </p>
        <p className="text-4xl md:text-6xl font-bold mt-6">
          believe in the SFF mission
        </p>
        <p className="text-2xl text-red-100 mt-10">
          From Lagos to Paris — one account at a time
        </p>
      </div>
    </div>
  );
}