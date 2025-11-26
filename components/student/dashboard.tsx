"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Zap, TrendingUp, Calendar, CheckCircle, AlertCircle, Flame, Trophy, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface DashboardProps {
  user: any;
  profile: any;
  exams: any[];
}

export default function StudentDashboard({ user, profile, exams }: DashboardProps) {
  const router = useRouter();
  const [stats, setStats] = useState({
    completed: 0,
    averageScore: 0,
    streak: 0,
    todayCompleted: 0,
    totalToday: exams.length,
  });
  const [completedToday, setCompletedToday] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient();
      try {
        const { data: attempts } = await supabase
          .from("exam_attempts")
          .select("exam_id, total_score, status, created_at")
          .eq("student_id", user.id)
          .order("created_at", { ascending: false });

        if (!attempts || attempts.length === 0) {
          setStats((prev) => ({ ...prev, completed: 0, averageScore: 0 }));
          setLoading(false);
          return;
        }

        // Today's date at midnight
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayAttempts = attempts.filter((a) => {
          const attemptDate = new Date(a.created_at);
          attemptDate.setHours(0, 0, 0, 0);
          return attemptDate.getTime() === today.getTime();
        });

        const completedTodayIds = todayAttempts.map((a) => a.exam_id);
        setCompletedToday(completedTodayIds);

        const gradedAttempts = attempts.filter((a) => a.status === "graded" && a.total_score !== null);
        const completedCount = gradedAttempts.length;
        const avgScore = completedCount > 0
          ? Math.round(gradedAttempts.reduce((sum, a) => sum + a.total_score, 0) / completedCount)
          : 0;

        // Simple streak (you can enhance this later)
        const streak = gradedAttempts.length > 0 ? 7 : 0;

        setStats({
          completed: completedCount,
          averageScore: avgScore,
          streak,
          todayCompleted: completedTodayIds.length,
          totalToday: exams.length,
        });
      } catch (error) {
        console.error("[SFF] Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchStats();
  }, [user?.id, exams.length]);

  const handleStartExam = (examId: string) => {
    router.push(`/exam/${examId}`);
  };

  const completedExams = exams.filter((e) => completedToday.includes(e.id));
  const pendingExams = exams.filter((e) => !completedToday.includes(e.id));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <p className="text-4xl font-Coolvetica text-[#0C1E46] animate-pulse">
          Bonjour, {profile?.first_name || "Champion"}...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 font-Coolvetica">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* HERO WELCOME */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-7xl font-black text-[#0C1E46] leading-tight">
            Bonjour, {profile?.first_name || "Étoile"}!
          </h1>
          <p className="text-2xl sm:text-4xl text-[#0C1E46]/80 mt-4">
            Today, we speak French like we were born in Paris
          </p>
        </div>

        {/* STATS GRID — EPIC */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-2xl transform hover:scale-105 transition-all">
            <CardContent className="pt-8 text-center">
              <Zap className="w-16 h-16 mx-auto mb-4" />
              <p className="text-5xl font-black">{stats.completed}</p>
              <p className="text-xl opacity-90">Exams Completed</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-2xl transform hover:scale-105 transition-all">
            <CardContent className="pt-8 text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4" />
              <p className="text-5xl font-black">{stats.averageScore}%</p>
              <Progress value={stats.averageScore} className="mt-4 h-6 rounded-full" />
              <p className="text-xl opacity-90 mt-2">Average Score</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-2xl transform hover:scale-105 transition-all">
            <CardContent className="pt-8 text-center">
              <Flame className="w-16 h-16 mx-auto mb-4 animate-pulse" />
              <p className="text-5xl font-black">{stats.streak}</p>
              <p className="text-xl opacity-90">Day Streak</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-2xl transform hover:scale-105 transition-all">
            <CardContent className="pt-8 text-center">
              <Target className="w-16 h-16 mx-auto mb-4" />
              <p className="text-5xl font-black">{stats.todayCompleted}/{stats.totalToday}</p>
              <p className="text-xl opacity-90">Today's Progress</p>
            </CardContent>
          </Card>
        </div>

        {/* TODAY'S TASKS */}
        <div className="mb-16">
          <h2 className="text-4xl font-black text-[#0C1E46] mb-8 text-center">Today's Mission</h2>

          {stats.todayCompleted === stats.totalToday && stats.totalToday > 0 && (
            <div className="text-center mb-12">
              <div className="inline-block bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-12 py-10 rounded-3xl shadow-3xl">
                <CheckCircle className="w-24 h-24 mx-auto mb-6" />
                <p className="text-5xl font-black">Mission Accomplished!</p>
                <p className="text-3xl mt-4">You’ve completed all tasks today</p>
                <p className="text-2xl mt-6 opacity-90">Naija to Paris — another step closer</p>
              </div>
            </div>
          )}

          {pendingExams.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pendingExams.map((exam) => (
                <Card
                  key={exam.id}
                  className="bg-white/95 backdrop-blur-xl shadow-2xl border-4 border-[#B0CCFE] hover:border-[#ED4137] hover:shadow-3xl transition-all transform hover:scale-105 cursor-pointer"
                  onClick={() => handleStartExam(exam.id)}
                >
                  <CardHeader className="text-center pb-8">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#ED4137] to-orange-600 rounded-full flex items-center justify-center shadow-xl">
                      <AlertCircle className="w-12 h-12 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-[#0C1E46]">{exam.title}</CardTitle>
                    <CardDescription className="text-lg mt-3">{exam.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center pt-6">
                    <Button
                      size="lg"
                      className="w-full h-16 text-xl font-bold bg-[#0C1E46] hover:bg-[#0a1838] shadow-xl"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartExam(exam.id);
                      }}
                    >
                      Start Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* FINAL MOTIVATION */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-[#0C1E46] via-[#ED4137] to-purple-700 text-white px-12 py-20 rounded-3xl shadow-4xl">
            <Trophy className="w-32 h-32 mx-auto mb-10 text-yellow-400" />
            <p className="text-6xl md:text-8xl font-black leading-tight">
              Every exam you take
            </p>
            <p className="text-6xl md:text-8xl font-black mt-8 text-[#B0CCFE]">
              Is a ticket to Paris
            </p>
            <p className="text-4xl mt-12 opacity-90">
              You’re not learning French — you’re becoming French
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}