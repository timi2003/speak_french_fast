import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ExamResults from "@/components/exam/exam-results"

export default async function ExamResultsPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { attemptId: string }
}) {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: attempt } = await supabase
    .from("exam_attempts")
    .select("*")
    .eq("id", searchParams.attemptId)
    .eq("student_id", user.id)
    .single()

  if (!attempt) {
    redirect("/dashboard")
  }

  const { data: responses } = await supabase
    .from("student_responses")
    .select(`
      id,
      question_id,
      selected_answer_id,
      text_response,
      exam_section_id,
      questions (
        id,
        question_text,
        question_type,
        difficulty_level,
        answer_options (id, option_letter, option_text, is_correct)
      ),
      exam_sections (
        id,
        title
      )
    `)
    .eq("student_id", user.id)
    .eq("exam_id", params.id)

  return <ExamResults attempt={attempt} responses={responses || []} />
}
