import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AdminDashboard from "@/components/admin/admin-dashboard"

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: userProfile } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (userProfile?.role !== "admin") {
    redirect("/dashboard")
  }

  return <AdminDashboard user={user} />
}
