"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LogOut,
  Upload,
  CalendarCheck,
  Users,
  Sparkles,
  Crown,
  Trophy,
} from "lucide-react";

import QuestionUploadForm from "@/components/admin/question-upload-form";
import DailyTasksManager from "@/components/admin/daily-tasks-manager";
import StudentProgressViewer from "@/components/admin/student-progress-viewer";

export default function AdminDashboard({ user }: { user: any }) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#B0CCFE]/20 to-indigo-50 font-Coolvetica overflow-x-hidden">
      <div className="fixed inset-0 bg-[url('/pattern.png')] opacity-5 -z-10" />
      <div className="fixed inset-0 bg-gradient-to-tr from-[#0C1E46]/5 via-transparent to-[#ED4137]/5 -z-10" />

      {/* ADMIN NAVBAR */}
      <nav className="bg-gradient-to-r from-[#0C1E46] to-[#0a1838] shadow-2xl px-8 py-6 sticky top-0 z-50 border-b-4 border-[#ED4137]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <img src="/logonobg.png" alt="SFF Admin" className="h-16 md:h-20 drop-shadow-lg" />
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-white">
                Admin <span className="text-[#ED4137]">Control</span> Hub
              </h1>
              <p className="text-blue-100 text-sm md:text-base">
                Logged in as: <span className="font-bold">{user?.email}</span>
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            size="lg"
            className="bg-white/10 backdrop-blur hover:bg-[#ED4137] text-white border-2 border-white/20 font-bold text-lg px-8 h-14 shadow-xl"
          >
            <LogOut className="w-6 h-6 mr-3" />
            Logout
          </Button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">

        {/* Welcome */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[#0C1E46] leading-tight">
            Welcome back, 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0C1E46] to-[#ED4137]">
              Admin
            </span>
          </h2>
          <p className="text-2xl md:text-3xl text-gray-700 mt-6 max-w-4xl mx-auto">
            You're not just managing you're <span className="text-[#ED4137] font-bold">changing lives</span>
          </p>
        </div>

        <Tabs defaultValue="questions" className="w-full">
          <TabsList className="grid grid-cols-3 w-full h-20 bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl mb-12 border-4 border-[#0C1E46]/10">
            <TabsTrigger value="questions" className="text-lg font-bold rounded-l-3xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0C1E46] data-[state=active]:to-[#0a1838] data-[state=active]:text-white data-[state=active]:shadow-xl flex items-center gap-4">
              <Upload className="w-8 h-8" /> Upload Questions
            </TabsTrigger>
            <TabsTrigger value="daily-tasks" className="text-lg font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ED4137] data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-xl flex items-center gap-4">
              <CalendarCheck className="w-8 h-8" /> Daily Tasks
            </TabsTrigger>
            <TabsTrigger value="student-progress" className="text-lg font-bold rounded-r-3xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-700 data-[state=active]:text-white data-[state=active]:shadow-xl flex items-center gap-4">
              <Users className="w-8 h-8" /> Student Progress
            </TabsTrigger>
          </TabsList>

          {/* QUESTIONS TAB — FULL BLEED NAVY */}
          <TabsContent value="questions" className="mt-0 -mx-4 px-4">
            <div className="bg-gradient-to-br from-[#0C1E46] to-[#0a1838] rounded-3xl shadow-3xl overflow-hidden">
              <div className="bg-black/30 backdrop-blur-md px-8 py-8 border-b-4 border-white/10">
                <div className="text-center text-white">
                  <h2 className="text-2xl md:text-4xl font-bold flex items-center justify-center gap-6">
                    <Sparkles className="w-16 h-16 text-yellow-300" />
                    Question Bank Manager
                  </h2>
                  <p className="text-2xl md:text-3xl text-blue-100 mt-4">
                    Craft the questions that will take Nigerian students to France
                  </p>
                </div>
              </div>
              <div className="bg-white/95 backdrop-blur-xl p-10">
                <QuestionUploadForm />
              </div>
            </div>
          </TabsContent>

          {/* DAILY TASKS TAB — FULL BLEED RED */}
          <TabsContent value="daily-tasks" className="mt-0 -mx-6 px-6">
            <div className="bg-gradient-to-br from-[#ED4137] to-red-600 rounded-3xl shadow-3xl overflow-hidden">
              <div className="bg-black/30 backdrop-blur-md px-10 py-12 border-b-4 border-white/10">
                <div className="text-center text-white">
                  <h2 className="text-2xl md:text-4xl font-bold flex items-center justify-center gap-6">
                    <CalendarCheck className="w-16 h-16 text-yellow-200" />
                    Daily Practice Manager
                  </h2>
                  <p className="text-2xl md:text-3xl text-red-100 mt-6">
                    Keep the fire burning — schedule tasks that build unbreakable habits
                  </p>
                </div>
              </div>
              <div className="bg-white/95 backdrop-blur-xl p-10">
                <DailyTasksManager />
              </div>
            </div>
          </TabsContent>

          {/* STUDENT PROGRESS TAB — FULL BLEED PURPLE/NAVY */}
          <TabsContent value="student-progress" className="mt-0 -mx-6 px-6">
            <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-[#0C1E46] rounded-3xl shadow-3xl overflow-hidden">
              <div className="bg-black/30 backdrop-blur-md px-10 py-12 border-b-4 border-white/10">
                <div className="text-center text-white">
                  <h2 className="text-2xl md:text-4xl font-bold flex items-center justify-center gap-6">
                    <Crown className="w-16 h-16 text-yellow-300" />
                    Student Progress & Analytics
                    <Trophy className="w-16 h-16 text-yellow-300" />
                  </h2>
                  <p className="text-2xl md:text-3xl text-white/90 mt-6 max-w-5xl mx-auto">
                    Watch Nigerian students crush French — one streak, one XP point, one dream at a time
                  </p>
                </div>
              </div>
              <div className="bg-white/95 backdrop-blur-xl">
                <StudentProgressViewer />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* FINAL MOTIVATIONAL BLOCK */}
        <div className="mt-32 text-center">
          <div className="bg-gradient-to-r from-[#0C1E46] via-[#ED4137] to-purple-700 text-white py-20 px-12 rounded-3xl shadow-3xl">
            <p className="text-5xl md:text-7xl font-bold">You are the reason</p>
            <p className="text-5xl md:text-7xl font-bold mt-6 text-[#B0CCFE]">
              Nigeria speaks French
            </p>
            <p className="text-3xl mt-10 opacity-90">
              <span className="text-yellow-300 font-bold">10,000+</span> students •{" "}
              <span className="text-yellow-300 font-bold">1 mission</span>
            </p>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#0C1E46] text-white py-12 mt-32 border-t-8 border-[#ED4137]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <img src="/logonobg2.png" alt="SFF" className="h-16 mx-auto mb-6 drop-shadow-2xl" />
          <p className="text-xl font-medium">
            © {new Date().getFullYear()} Speak French Fast Academy • Admin Portal
          </p>
        </div>
      </footer>
    </div>
  );
}