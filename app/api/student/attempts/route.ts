import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: attempts, error } = await supabase
      .from("exam_attempts")
      .select(`
        id,
        exam_id,
        start_time,
        end_time,
        total_score,
        cecrl_level,
        status,
        exams (
          id,
          title,
          description
        )
      `)
      .eq("student_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(attempts)
  } catch (error) {
    console.error("[GET_ATTEMPTS]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch attempts" },
      { status: 500 },
    )
  }
}
