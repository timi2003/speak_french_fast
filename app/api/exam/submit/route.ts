import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { module_name, questions_attempted, time_taken_seconds } = body

    // Calculate score
    let correct_count = 0
    questions_attempted.forEach((attempt: any) => {
      if (attempt.correct) correct_count++
    })

    const score = (correct_count / questions_attempted.length) * 100

    // Store exam attempt
    const { data, error } = await supabase
      .from("exam_attempts")
      .insert({
        user_id: user.id,
        module_name,
        questions_attempted,
        score,
        total_questions: questions_attempted.length,
        time_taken_seconds,
      })
      .select()
      .single()

    if (error) throw error

    // Update progress
    const { data: progress } = await supabase.from("progress").select("*").eq("user_id", user.id).single()

    const tasksToday = progress?.tasks_completed_today || []
    const updatedTasks = [...tasksToday, module_name]

    await supabase
      .from("progress")
      .update({
        tasks_completed_today: updatedTasks,
        xp_points: (progress?.xp_points || 0) + Math.round(score),
      })
      .eq("user_id", user.id)

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Exam submission error:", error)
    return NextResponse.json({ error: "Failed to submit exam" }, { status: 500 })
  }
}
