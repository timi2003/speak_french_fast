import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ExamInterface from "@/components/exam/exam-interface"

export default async function ExamPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: exam } = await supabase.from("exams").select("*").eq("id", params.id).single()

  if (!exam) {
    redirect("/dashboard")
  }

  const { data: sections } = await supabase
    .from("exam_sections")
    .select("*")
    .eq("exam_id", params.id)
    .order("order_index")

  return <ExamInterface exam={exam} sections={sections || []} userId={user.id} />
}
