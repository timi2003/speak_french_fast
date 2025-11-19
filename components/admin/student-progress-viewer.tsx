"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

  const topStreaker = students.reduce((prev, current) => 
    (prev.progress?.[0]?.streak_count || 0) > (current.progress?.[0]?.streak_count || 0) ? prev : current
  , { progress: [{ streak_count: 0 }] });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-4xl font-bold text-[#0C1E46] animate-pulse">
          Loading champions...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-16 font-Coolvetica">

        {/* HERO HEADER */}
        <div className="text-center pt-10">
          <div className="inline-block bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white px-16 py-12 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500">
            <Users className="w-24 h-24 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Student <span className="text-[#ED4137]">Progress</span>
            </h1>
            <p className="text-2xl md:text-2xl text-blue-100 mt-6 max-w-4xl mx-auto">
              Every streak, every XP point, every day completed — 
              <span className="block mt-3 font-bold text-[#B0CCFE]">
                This is Nigeria rising to speak French fluently
              </span>
            </p>
          </div>
        </div>

        {/* KEY METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="bg-gradient-to-br from-[#0C1E46] to-[#0a1838] text-white shadow-2xl hover:shadow-3xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-4">
                <Users className="w-12 h-12" />
                Total Learners
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-7xl font-bold">{totalStudents.toLocaleString()}</p>
              <p className="text-blue-100 text-lg mt-3">Proud SFF students</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#ED4137] to-red-600 text-white shadow-2xl hover:shadow-3xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-4">
                <CheckCircle className="w-12 h-12" />
                Active Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-7xl font-bold">{activeToday}</p>
              <p className="text-red-100 text-lg mt-3">Grinding French right now</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-2xl hover:shadow-3xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-4">
                <Flame className="w-12 h-12" />
                Avg Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-7xl font-bold">{avgStreak}</p>
              <p className="text-orange-100 text-lg mt-3">days of fire consistency</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-2xl hover:shadow-3xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-4">
                <Trophy className="w-12 h-12" />
                Top Streaker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold">{topStreaker.progress?.[0]?.streak_count || 0} days</p>
              <p className="text-purple-100 text-lg mt-3">
                {topStreaker.full_name?.split(" ")[0] || "A champion"} is on fire!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* SEARCH BAR */}
        <div className="max-w-4xl mx-auto relative">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-10 h-10 text-[#0C1E46]" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-24 h-24 text-3xl font-medium border-4 border-[#0C1E46] rounded-full shadow-2xl focus:border-[#ED4137] transition-all"
          />
        </div>

        {/* STUDENTS TABLE */}
        <Card className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border-0 overflow-hidden shadow-3xl">
          <CardHeader className="bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white py-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <CardTitle className="text-4xl md:text-5xl font-bold flex items-center gap-5">
                  <Award className="w-12 h-12" />
                  Student Leaderboard
                </CardTitle>
                <CardDescription className="text-blue-100 text-xl mt-4">
                  {filteredStudents.length} {filteredStudents.length === 1 ? "student" : "students"} found
                  {searchQuery && ` matching "${searchQuery}"`}
                </CardDescription>
              </div>
              <TrendingUp className="w-16 h-16 text-[#B0CCFE] animate-pulse" />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#B0CCFE]/20 hover:bg-[#B0CCFE]/30">
                    <TableHead className="text-[#0C1E46] font-bold text-lg py-6">Rank & Name</TableHead>
                    <TableHead className="text-[#0C1E46] font-bold text-lg py-6">Email</TableHead>
                    <TableHead className="text-[#0C1E46] font-bold text-lg py-6 text-center">Plan</TableHead>
                    <TableHead className="text-[#0C1E46] font-bold text-lg py-6 text-center">
                      <Flame className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                      Streak
                    </TableHead>
                    <TableHead className="text-[#0C1E46] font-bold text-lg py-6 text-center">
                      <Trophy className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                      XP
                    </TableHead>
                    <TableHead className="text-[#0C1E46] font-bold text-lg py-6 text-center">
                      <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      Days
                    </TableHead>
                    <TableHead className="text-[#0C1E46] font-bold text-lg py-6 text-center">
                      <Clock className="w-7 h-7 mx-auto mb-2" />
                      Last Active
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-24 text-2xl text-gray-500 font-medium">
                        No students found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((student, index) => {
                      const progress = student.progress?.[0] || {};
                      const lastLogin = progress.last_login
                        ? new Date(progress.last_login).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Never";

                      const isTop3 = index < 3;

                      return (
                        <TableRow
                          key={student.id}
                          className={`hover:bg-gradient-to-r hover:from-[#B0CCFE]/10 hover:to-purple-50 transition-all ${
                            isTop3 ? "bg-gradient-to-r from-yellow-50 to-orange-50" : ""
                          }`}
                        >
                          <TableCell className="py-6">
                            <div className="flex items-center gap-5">
                              <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-2xl ${
                                index === 0 ? "bg-yellow-400 text-yellow-900" :
                                index === 1 ? "bg-gray-300 text-gray-700" :
                                index === 2 ? "bg-orange-400 text-orange-900" :
                                "bg-[#B0CCFE] text-[#0C1E46]"
                              }`}>
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-bold text-xl text-[#0C1E46]">
                                  {student.full_name || "Student"}
                                </p>
                                {isTop3 && <Badge className="mt-1">Top {index + 1}</Badge>}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-700 text-lg">{student.email}</TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="outline"
                              className={`text-lg px-6 py-2 font-bold ${
                                student.subscription_plan === "premium"
                                  ? "bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 border-orange-300"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {student.subscription_plan || "free"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-3xl font-bold text-orange-600">
                              {progress.streak_count || 0}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-3xl font-bold text-purple-600">
                              {progress.xp_points || 0}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-3xl font-bold text-blue-600">
                              {progress.day_completed || 0}
                            </span>
                            <span className="text-gray-500">/30</span>
                          </TableCell>
                          <TableCell className="text-center text-gray-600 font-medium text-lg">
                            {lastLogin}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* FINAL MOTIVATION */}
        <div className="text-center py-20 bg-gradient-to-r from-[#0C1E46] via-[#ED4137] to-purple-800 text-white rounded-3xl shadow-3xl">
          <p className="text-5xl md:text-7xl font-bold leading-tight">
            {totalStudents.toLocaleString()} Nigerian dreams
          </p>
          <p className="text-5xl md:text-7xl font-bold mt-6 text-[#B0CCFE]">
            are becoming French reality
          </p>
          <p className="text-3xl mt-10 text-white/90">
            Because of <span className="text-[#ED4137] font-bold">YOU</span>
          </p>
        </div>
      </div>
    </div>
  );
}