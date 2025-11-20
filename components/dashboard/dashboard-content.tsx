"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LogOut,
  BookOpen,
  Flame,
  Trophy,
  Volume2,
  FileText,
  Settings,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface Props {
  user: any;
  userProfile: any;
  progress: any;
  dailyTasks: any[];
}

export default function DashboardContent({
  user,
  userProfile,
  progress,
  dailyTasks,
}: Props) {
  const router = useRouter();
  const isAdmin = userProfile?.role === "admin";

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 font-Coolvetica">
      {/* Subtle hero overlay */}
      <div className="absolute inset-0 bg-[url('/hero.jpeg')] opacity-10 bg-cover bg-center -z-10" />

      {/* ────── NAVBAR ────── */}
      <nav className="bg-[#0C1E46] shadow-md px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logonobg.png" alt="SFF Logo" className="h-12" />
          <span className="text-2xl font-bold text-white hidden sm:inline">
            Speak <span className="text-[#ED4137]">French</span> Fast
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-white hidden md:block">
            Hi, <span className="font-semibold">{userProfile?.full_name?.split(" ")[0] || "Learner"}</span>
          </span>

          {isAdmin && (
            <Link href="/admin">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-[#ED4137] hover:border-[#ED4137] transition"
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </Link>
          )}

          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-white text-white hover:bg-[#ED4137] hover:border-[#ED4137] transition"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>

      {/* ────── MAIN CONTENT ────── */}
      <main className="max-w-7xl mx-auto px-4 py-10">

        {/* ────── WELCOME HERO ────── */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#0C1E46]">
            Welcome back, <span className="text-[#ED4137]">{userProfile?.full_name?.split(" ")[0] || "Learner"}</span>!
          </h1>
          <p className="text-xl text-gray-700 mt-3">
            Naija to Paris – Pass DELF/TEF in 30 days with SFF
          </p>
        </div>

        {/* ────── STATS GRID ────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Streak */}
          <Card className="bg-white/95 backdrop-blur shadow-lg border border-gray-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-[#0C1E46]">
                <Flame className="w-6 h-6 text-orange-500" />
                Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#0C1E46]">{progress?.streak_count || 0}</div>
              <p className="text-sm text-gray-600 mt-1">days on fire</p>
            </CardContent>
          </Card>

          {/* XP */}
          <Card className="bg-white/95 backdrop-blur shadow-lg border border-gray-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-[#0C1E46]">
                <Trophy className="w-6 h-6 text-yellow-500" />
                XP Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#0C1E46]">{progress?.xp_points || 0}</div>
              <p className="text-sm text-gray-600 mt-1">earned so far</p>
            </CardContent>
          </Card>

          {/* Days Completed */}
          <Card className="bg-white/95 backdrop-blur shadow-lg border border-gray-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-[#0C1E46]">
                <BookOpen className="w-6 h-6 text-blue-600" />
                Days Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#0C1E46]">{progress?.day_completed || 0}</div>
              <p className="text-sm text-gray-600 mt-1">of 30</p>
            </CardContent>
          </Card>
        </div>

        {/* ────── TODAY'S TASKS ────── */}
        <Card className="mb-12 bg-white/95 backdrop-blur shadow-lg border border-gray-100">
          <CardHeader>
            <CardTitle className="text-2xl text-[#0C1E46]">Today’s Tasks</CardTitle>
            <CardDescription className=" text-[#0C1E46]">
              Complete your daily practice – every step counts!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dailyTasks?.length ? (
              dailyTasks.map((task: any) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-5 rounded-xl border border-gray-200 hover:border-[#B0CCFE] hover:bg-[#B0CCFE]/5 transition"
                >
                  <div className="flex items-center gap-4">
                    {task.task_type === "listening" && <Volume2 className="w-6 h-6 text-white" />}
                    {task.task_type === "reading" && <FileText className="w-6 h-6 text-white" />}
                    {task.task_type === "writing" && <BookOpen className="w-6 h-6 text-white" />}
                    <div>
                      <p className="font-semibold capitalize text-[#0C1E46]">
                        Day {task.day_number} – {task.task_type}
                      </p>
                      <p className="text-sm text-gray-600">{task.instructions}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => router.push(`/exam/${task.task_type}`)}
                    className="bg-[#ED4137] hover:bg-red-600 text-white"
                  >
                    Start <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-[#0C1E46] py-6">No tasks for today – enjoy a rest day!</p>
            )}
          </CardContent>
        </Card>

        {/* ────── QUICK ACTIONS GRID ────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Subscription Card */}
          <Card className="bg-gradient-to-br from-[#0C1E46] to-[#0a1838] text-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                Your Plan
              </CardTitle>
              <CardDescription className="text-blue-100">
                Current: <span className="font-bold capitalize">{userProfile?.subscription_plan || "free"}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-[#ED4137] hover:bg-red-600 text-white font-semibold">
                Upgrade to Premium
              </Button>
            </CardContent>
          </Card>

          {/* Exam Modules */}
          <Card className="bg-white/95 backdrop-blur shadow-lg border border-gray-100">
            <CardHeader>
              <CardTitle className="text-2xl text-[#0C1E46]">Practice Modules</CardTitle>
              <CardDescription className=" text-[#0C1E46]">Jump straight into any skill</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start h-12 border-[#0C1E46] text-white hover:bg-[#B0CCFE]/20"
                onClick={() => router.push("/exam/listening")}
              >
                <Volume2 className="w-5 h-5 mr-3 text-white" />
                Listening
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-12 border-[#0C1E46] text-white hover:bg-[#B0CCFE]/20"
                onClick={() => router.push("/exam/reading")}
              >
                <FileText className="w-5 h-5 mr-3 text-white" />
                Reading
              </Button>

             <Button
                variant="outline"
                className="w-full justify-start h-12 border-[#0C1E46] text-white hover:bg-[#B0CCFE]/20"
                onClick={() => router.push("/exam/writing")}
              >
                <FileText className="w-5 h-5 mr-3 text-white" />
                Writing 
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-12 border-[#0C1E46] text-white hover:bg-[#B0CCFE]/20"
                onClick={() => router.push("/exam/")}
              >
                <FileText className="w-5 h-5 mr-3 text-white" />
                Speaking 
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* ────── MOTIVATION FOOTER ────── */}
        <div className="mt-20 text-center">
          <p className="text-lg text-gray-700">
            <span className="font-bold text-[#ED4137]">10,000+</span> Nigerians have passed their French exams with SFF.
            <br />
            <span className="text-[#0C1E46] font-medium">Your success story starts right here.</span>
          </p>
        </div> 
      </main>

      {/* ────── FOOTER ────── */}
      <footer className="bg-[#0C1E46] text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <img src="/logonobg2.png" alt="SFF Footer" className="h-12 mx-auto mb-4" />
          <p className="text-sm">
            © {new Date().getFullYear()} Speak French Fast Academy. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <Link href="/privacy" className="hover:text-[#B0CCFE]">Privacy</Link>
            <Link href="/terms" className="hover:text-[#B0CCFE]">Terms</Link>
            <Link href="/contact" className="hover:text-[#B0CCFE]">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}