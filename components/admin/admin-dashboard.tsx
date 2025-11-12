"use client"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut } from "lucide-react"
import QuestionUploadForm from "@/components/admin/question-upload-form"
import DailyTasksManager from "@/components/admin/daily-tasks-manager"
import StudentProgressViewer from "@/components/admin/student-progress-viewer"

export default function AdminDashboard({ user }: any) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage questions, tasks, and students</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="questions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="questions">Upload Questions</TabsTrigger>
            <TabsTrigger value="daily-tasks">Daily Tasks</TabsTrigger>
            <TabsTrigger value="student-progress">Student Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upload Exam Questions</CardTitle>
                <CardDescription>
                  Add new questions to the question bank for Listening, Reading, and Writing modules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QuestionUploadForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="daily-tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Manage Daily Tasks</CardTitle>
                <CardDescription>Create and assign daily speaking and practice tasks for students</CardDescription>
              </CardHeader>
              <CardContent>
                <DailyTasksManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="student-progress" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Student Progress & Analytics</CardTitle>
                <CardDescription>Monitor student performance, streaks, and subscription status</CardDescription>
              </CardHeader>
              <CardContent>
                <StudentProgressViewer />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
