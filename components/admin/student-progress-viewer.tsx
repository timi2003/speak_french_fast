"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Flame,
  Trophy,
  Calendar,
  Search,
  CheckCircle,
  TrendingUp,
  Award,
  Clock,
} from "lucide-react";

export default function StudentProgressViewer() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("users")
        .select(`
          *,
          progress:progress(*),
          subscriptions:subscriptions(*)
        `)
        .eq("role", "student")
        .order("created_at", { ascending: false });

      setStudents(data || []);
    } catch (error) {
      console.error("[SFF] Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalStudents = students.length;
  const activeToday = students.filter((s) => {
    const lastLogin = s.progress?.[0]?.last_login;
    if (!lastLogin) return false;
    return new Date(lastLogin).toDateString() === new Date().toDateString();
  }).length;

  const avgStreak = (
    students.reduce((sum, s) => sum + (s.progress?.[0]?.streak_count || 0), 0) /
    (students.length || 1)
  ).toFixed(1);

  const topStreaker = students.reduce(
    (prev, current) =>
      (prev.progress?.[0]?.streak_count || 0) > (current.progress?.[0]?.streak_count || 0)
        ? prev
        : current,
    { progress: [{ streak_count: 0 }], full_name: "Unknown" }
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl md:text-3xl font-bold text-[#0C1E46] animate-pulse">
          Loading champions...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 font-Coolvetica px-4 py-8 md:py-12">

      {/* HERO HEADER — Compact & Powerful */}
      <div className="text-center">
        <div className="inline-block bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white px-8 py-8 md:py-10 rounded-2xl shadow-xl">
          <Users className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4" />
          <h1 className="text-3xl md:text-5xl font-bold">
            Student <span className="text-[#ED4137]">Progress</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mt-4 max-w-3xl mx-auto">
            Watch Nigeria rise — one streak, one XP point at a time
          </p>
        </div>
      </div>

      {/* KEY METRICS — Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-gradient-to-br from-[#0C1E46] to-[#0a1838] text-white rounded-2xl p-6 shadow-lg">
          <Users className="w-10 h-10 mb-3" />
          <p className="text-3xl md:text-4xl font-bold">{totalStudents.toLocaleString()}</p>
          <p className="text-blue-100 text-sm md:text-base mt-1">Total Students</p>
        </div>

        <div className="bg-gradient-to-br from-[#ED4137] to-red-600 text-white rounded-2xl p-6 shadow-lg">
          <CheckCircle className="w-10 h-10 mb-3" />
          <p className="text-3xl md:text-4xl font-bold">{activeToday}</p>
          <p className="text-red-100 text-sm md:text-base mt-1">Active Today</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-2xl p-6 shadow-lg">
          <Flame className="w-10 h-10 mb-3" />
          <p className="text-3xl md:text-4xl font-bold">{avgStreak}</p>
          <p className="text-orange-100 text-sm md:text-base mt-1">Avg Streak (days)</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-2xl p-6 shadow-lg">
          <Trophy className="w-10 h-10 mb-3" />
          <p className="text-2xl md:text-3xl font-bold">{topStreaker.progress?.[0]?.streak_count || 0} days</p>
          <p className="text-purple-100 text-sm md:text-base mt-1">
            {topStreaker.full_name?.split(" ")[0] || "Champion"} leads!
          </p>
        </div>
      </div>

      {/* SEARCH BAR — Mobile-Friendly */}
      <div className="max-w-2xl mx-auto relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#0C1E46]" />
        <Input
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-14 h-14 text-lg border-2 rounded-xl shadow-md focus:border-[#ED4137]"
        />
      </div>

      {/* LEADERBOARD TABLE — Mobile Cards + Desktop Table */}
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-[#0C1E46] to-[#0a1838] px-6 py-5 md:px-8 md:py-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Award className="w-8 h-8 md:w-10 md:h-10" />
            Student Leaderboard
          </h2>
          <p className="text-blue-100 text-sm md:text-base mt-1">
            {filteredStudents.length} {filteredStudents.length === 1 ? "student" : "students"} found
          </p>
        </div>

        {/* Mobile: Card List */}
        <div className="md:hidden divide-y divide-gray-200">
          {filteredStudents.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No students found</div>
          ) : (
            filteredStudents.map((student, index) => {
              const p = student.progress?.[0] || {};
              const isTop3 = index < 3;
              return (
                <div key={student.id} className={`p-6 ${isTop3 ? "bg-gradient-to-r from-yellow-50 to-orange-50" : ""}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                        index === 0 ? "bg-yellow-400" :
                        index === 1 ? "bg-gray-300" :
                        index === 2 ? "bg-orange-400" :
                        "bg-[#B0CCFE] text-[#0C1E46]"
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-bold text-lg text-[#0C1E46]">{student.full_name || "Student"}</p>
                        <p className="text-sm text-gray-600">{student.email}</p>
                      </div>
                    </div>
                    {isTop3 && <Badge className="text-sm">Top {index + 1}</Badge>}
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <Flame className="w-6 h-6 mx-auto text-orange-600 mb-1" />
                      <p className="font-bold text-xl">{p.streak_count || 0}</p>
                      <p className="text-xs text-gray-600">Streak</p>
                    </div>
                    <div>
                      <Trophy className="w-6 h-6 mx-auto text-purple-600 mb-1" />
                      <p className="font-bold text-xl">{p.xp_points || 0}</p>
                      <p className="text-xs text-gray-600">XP</p>
                    </div>
                    <div>
                      <Calendar className="w-6 h-6 mx-auto text-blue-600 mb-1" />
                      <p className="font-bold text-xl">{p.day_completed || 0}/30</p>
                      <p className="text-xs text-gray-600">Days</p>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <Badge variant={student.subscription_plan === "premium" ? "default" : "secondary"}>
                      {student.subscription_plan || "free"}
                    </Badge>
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
                <th className="text-left p-5 font-bold text-[#0C1E46]">Rank & Name</th>
                <th className="text-left p-5 font-bold text-[#0C1E46]">Email</th>
                <th className="text-center p-5 font-bold text-[#0C1E46]">Plan</th>
                <th className="text-center p-5 font-bold text-[#0C1E46]">Streak</th>
                <th className="text-center p-5 font-bold text-[#0C1E46]">XP</th>
                <th className="text-center p-5 font-bold text-[#0C1E46]">Days</th>
                <th className="text-center p-5 font-bold text-[#0C1E46]">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-xl text-gray-500">
                    No students found
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => {
                  const p = student.progress?.[0] || {};
                  const lastLogin = p.last_login
                    ? new Date(p.last_login).toLocaleDateString("en-GB")
                    : "Never";
                  const isTop3 = index < 3;

                  return (
                    <tr
                      key={student.id}
                      className={`border-b hover:bg-[#B0CCFE]/5 transition ${
                        isTop3 ? "bg-gradient-to-r from-yellow-50 to-orange-50" : ""
                      }`}
                    >
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                            index === 0 ? "bg-yellow-400" :
                            index === 1 ? "bg-gray-300" :
                            index === 2 ? "bg-orange-400" :
                            "bg-[#B0CCFE] text-[#0C1E46]"
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-bold text-lg">{student.full_name || "Student"}</p>
                            {isTop3 && <Badge className="text-xs">Top {index + 1}</Badge>}
                          </div>
                        </div>
                      </td>
                      <td className="p-5 text-gray-700">{student.email}</td>
                      <td className="p-5 text-center">
                        <Badge variant={student.subscription_plan === "premium" ? "default" : "secondary"}>
                          {student.subscription_plan || "free"}
                        </Badge>
                      </td>
                      <td className="p-5 text-center">
                        <span className="text-2xl font-bold text-orange-600">{p.streak_count || 0}</span>
                      </td>
                      <td className="p-5 text-center">
                        <span className="text-2xl font-bold text-purple-600">{p.xp_points || 0}</span>
                      </td>
                      <td className="p-5 text-center">
                        <span className="text-2xl font-bold text-blue-600">
                          {p.day_completed || 0}<span className="text-sm text-gray-500">/30</span>
                        </span>
                      </td>
                      <td className="p-5 text-center text-gray-600">{lastLogin}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FINAL MOTIVATION — Compact */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-[#0C1E46] via-[#ED4137] to-purple-700 text-white py-12 px-8 rounded-2xl shadow-2xl">
          <p className="text-3xl md:text-5xl font-bold">
            {totalStudents.toLocaleString()} Nigerian dreams
          </p>
          <p className="text-3xl md:text-5xl font-bold mt-4 text-[#B0CCFE]">
            becoming French reality
          </p>
          <p className="text-xl md:text-2xl mt-6 opacity-90">
            Because of <span className="text-yellow-300 font-bold">YOU</span>
          </p>
        </div>
      </div>
    </div>
  );
}