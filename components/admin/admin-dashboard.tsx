"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Settings, Upload, CalendarDays, Users } from "lucide-react";

import ModuleConfig from "@/components/admin/module-config";
import EnhancedQuestionUpload from "@/components/admin/enhanced-question-upload";
import CycleTaskManager from "@/components/admin/cycle-task-manager";
import StudentProgressViewer from "@/components/admin/student-progress-viewer";

export default function AdminDashboard({ user }: any) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#B0CCFE]/5 to-indigo-50">
      {/* Subtle Brand Overlay */}
      <div className="fixed inset-0 bg-[url('/pattern.png')] opacity-5 pointer-events-none -z-10" />
      <div className="fixed inset-0 bg-gradient-to-tr from-[#0C1E46]/3 to-[#ED4137]/3 pointer-events-none -z-10" />

      {/* Header */}
      <header className="bg-gradient-to-r from-[#0C1E46] to-[#0a1838] shadow-lg border-b-4 border-[#B0CCFE]/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <img src="/logonobg.png" alt="SFF" className="h-10 md:h-12" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">
                Admin <span className="text-[#ED4137]">Dashboard</span>
              </h1>
              <p className="text-xs text-blue-200 hidden sm:block">{user?.email}</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="bg-white/10 hover:bg-[#ED4137] text-white border border-white/20 h-10 px-5 text-sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        {/* Greeting */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-bold text-[#0C1E46]">
            Welcome back, <span className="text-[#ED4137]">Admin</span>
          </h2>
          <p className="text-base md:text-lg text-gray-700 mt-2">
            Manage modules, questions, tasks, and student progress
          </p>
        </div>

        {/* Responsive Tabs */}
        <Tabs defaultValue="module-config" className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full h-14 bg-white/90 backdrop-blur-md shadow-md rounded-xl mb-8 border border-gray-200">
            <TabsTrigger
              value="module-config"
              className="text-[#0C1E46] text-xs sm:text-sm font-medium data-[state=active]:bg-[#0C1E46] data-[state=active]:text-white rounded-l-xl sm:rounded-none flex items-center justify-center gap-2"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Module</span> Config
            </TabsTrigger>
            <TabsTrigger
              value="questions"
              className="text-[#0C1E46] text-xs sm:text-sm font-medium data-[state=active]:bg-[#0C1E46] data-[state=active]:text-white flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload</span> Questions
            </TabsTrigger>
            <TabsTrigger
              value="daily-tasks"
              className="text-[#0C1E46] text-xs sm:text-sm font-medium data-[state=active]:bg-[#ED4137] data-[state=active]:text-white flex items-center justify-center gap-2"
            >
              <CalendarDays className="w-4 h-4" />
              <span className="hidden sm:inline">Daily</span> Tasks
            </TabsTrigger>
            <TabsTrigger
              value="student-progress"
              className="text-[#0C1E46] text-xs sm:text-sm font-medium data-[state=active]:bg-[#0C1E46] data-[state=active]:text-white rounded-r-xl sm:rounded-none flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Student</span> Progress
            </TabsTrigger>
          </TabsList>

          {/* Module Config */}
          <TabsContent value="module-config">
            <Card className="bg-[#0C1E46] border-2 border-[#B0CCFE]/30 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white rounded-t-lg">
                <CardTitle className="text-lg md:text-xl">Module Configuration</CardTitle>
                <CardDescription className="text-blue-100">
                  Configure timer, instructions, and scoring for each exam section
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-white">
                <ModuleConfig />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upload Questions */}
          <TabsContent value="questions">
            <Card className="bg-[#0C1E46] border-2 border-[#B0CCFE]/30 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white rounded-t-lg">
                <CardTitle className="text-lg md:text-xl">Upload Exam Questions</CardTitle>
                <CardDescription className="text-blue-100">
                  Add and organize questions by module with full control
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-white">
                <EnhancedQuestionUpload />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Daily Tasks */}
          <TabsContent value="daily-tasks">
            <Card className="bg-[#ED4137] border-2 border-red-500/30 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-[#ED4137] to-red-600 text-white rounded-t-lg">
                <CardTitle className="text-lg md:text-xl">Manage Daily Tasks</CardTitle>
                <CardDescription className="text-red-100">
                  Create and customize 30-day learning cycles
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-white">
                <CycleTaskManager />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Student Progress */}
          <TabsContent value="student-progress">
            <Card className="bg-[#0C1E46] border-2 border-[#B0CCFE]/30 shadow-lg ">
              <CardHeader className="bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white rounded-t-lg">
                <CardTitle className="text-lg md:text-xl">Student Progress & Analytics</CardTitle>
                <CardDescription className="text-blue-100">
                  Monitor performance, streaks, and subscription status
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-white">
                <StudentProgressViewer />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-[#0C1E46] text-white py-8 mt-16 border-t-4 border-[#B0CCFE]/20">
        <div className="container mx-auto px-4 text-center">
          <img src="/logonobg2.png" alt="SFF" className="h-10 mx-auto mb-3" />
          <p className="text-sm">
            © {new Date().getFullYear()} Speak French Fast Academy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}