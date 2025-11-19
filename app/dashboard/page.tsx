import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import DashboardContent from "@/components/dashboard/dashboard-content"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: userProfile } = await supabase.from("users").select("*").eq("id", user.id).single()

  const { data: progress } = await supabase.from("progress").select("*").eq("user_id", user.id).single()

  const { data: dailyTasks } = await supabase.from("daily_tasks").select("*").limit(5).order("day_number")

  return <DashboardContent user={user} userProfile={userProfile} progress={progress} dailyTasks={dailyTasks} />
}
