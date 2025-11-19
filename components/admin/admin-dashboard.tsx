"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#B0CCFE]/10 to-indigo-50 font-Coolvetica">
      <div className="fixed inset-0 bg-[url('/pattern.png')] opacity-5 -z-10" />
      <div className="fixed inset-0 bg-gradient-to-tr from-[#0C1E46]/5 to-[#ED4137]/5 -z-10" />

      {/* NAVBAR — Compact & Mobile-Friendly */}
      <nav className="bg-gradient-to-r from-[#0C1E46] to-[#0a1838] shadow-xl px-4 py-4 sticky top-0 z-50 border-b-4 border-[#ED4137]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logonobg.png" alt="SFF" className="h-12 md:h-14" />
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-white">
                Admin <span className="text-[#ED4137]">Hub</span>
              </h1>
              <p className="text-xs md:text-sm text-blue-100 hidden sm:block">
                {user?.email}
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            size="sm"
            className="bg-white/10 hover:bg-[#ED4137] text-white border border-white/20 font-medium px-4 h-10 text-sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 md:px-6 md:py-10">

        {/* Welcome — Compact & Powerful */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold text-[#0C1E46]">
            Welcome back,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#0C1E46] to-[#ED4137]">
              Admin
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mt-3">
            You're <span className="text-[#ED4137] font-bold">changing lives</span> in Nigeria
          </p>
        </div>

        {/* TABS — Compact, Clean, Responsive */}
        <Tabs defaultValue="questions" className="w-full">
          <TabsList className="grid grid-cols-3 w-full h-14 md:h-16 bg-white/90 backdrop-blur-lg shadow-lg rounded-2xl mb-8 border border-gray-200">
            <TabsTrigger
              value="questions"
              className="text-sm md:text-[#0C1E46] font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0C1E46] data-[state=active]:to-[#0a1838] data-[state=active]:text-white rounded-l-2xl flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Questions
            </TabsTrigger>
            <TabsTrigger
              value="daily-tasks"
              className="text-sm md:text-[#0C1E46] font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ED4137] data-[state=active]:to-red-600 data-[state=active]:text-white flex items-center justify-center gap-2"
            >
              <CalendarCheck className="w-5 h-5" />
              Tasks
            </TabsTrigger>
            <TabsTrigger
              value="student-progress"
              className="text-sm md:text-[#0C1E46] font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-700 data-[state=active]:text-white rounded-r-2xl flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" />
              Students
            </TabsTrigger>
          </TabsList>

          {/* QUESTIONS TAB */}
          <TabsContent value="questions" className="mt-0">
            <div className="bg-gradient-to-br from-[#0C1E46] to-[#0a1838] rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-black/30 backdrop-blur px-6 py-6 md:px-8 md:py-8">
                <div className="text-center text-white">
                  <h2 className="text-2xl md:text-4xl font-bold flex items-center justify-center gap-3">
                    <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-yellow-300" />
                    Question Bank
                  </h2>
                  <p className="text-sm md:text-lg text-blue-100 mt-2">
                    Upload questions that power fluency
                  </p>
                </div>
              </div>
              <div className="bg-white/95 p-6 md:p-8">
                <QuestionUploadForm />
              </div>
            </div>
          </TabsContent>

          {/* DAILY TASKS TAB */}
          <TabsContent value="daily-tasks" className="mt-0">
            <div className="bg-gradient-to-br from-[#ED4137] to-red-600 rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-black/30 backdrop-blur px-6 py-6 md:px-8 md:py-8">
                <div className="text-center text-white">
                  <h2 className="text-2xl md:text-4xl font-bold flex items-center justify-center gap-3">
                    <CalendarCheck className="w-10 h-10 md:w-12 md:h-12 text-yellow-200" />
                    Daily Tasks
                  </h2>
                  <p className="text-sm md:text-lg text-red-100 mt-2">
                    Keep students consistent every day
                  </p>
                </div>
              </div>
              <div className="bg-white/95 p-6 md:p-8">
                <DailyTasksManager />
              </div>
            </div>
          </TabsContent>

          {/* STUDENT PROGRESS TAB */}
          <TabsContent value="student-progress" className="mt-0">
            <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-[#0C1E46] rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-black/30 backdrop-blur px-6 py-6 md:px-8 md:py-8">
                <div className="text-center text-white">
                  <h2 className="text-2xl md:text-4xl font-bold flex items-center justify-center gap-3">
                    <Crown className="w-10 h-10 md:w-12 md:h-12 text-yellow-300" />
                    Student Progress
                    <Trophy className="w-10 h-10 md:w-12 md:h-12 text-yellow-300" />
                  </h2>
                  <p className="text-sm md:text-lg text-white/90 mt-2">
                    Track streaks, XP, and real impact
                  </p>
                </div>
              </div>
              <div className="bg-white/95">
                <StudentProgressViewer />
              </div>
            </div>
          </TabsContent>
        </Tabs>

       
      </main>

      {/* FOOTER — Clean */}
      <footer className="bg-[#0C1E46] text-white py-8 mt-20 border-t-4 border-[#ED4137]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <img src="/logonobg2.png" alt="SFF" className="h-12 mx-auto mb-3" />
          <p className="text-sm md:text-base">
            © {new Date().getFullYear()} Speak French Fast Academy
          </p>
        </div>
      </footer>
    </div>
  );
}