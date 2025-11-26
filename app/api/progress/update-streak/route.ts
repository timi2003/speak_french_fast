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

    const { data: progress } = await supabase.from("progress").select("*").eq("user_id", user.id).single()

    const tasksToday = progress?.tasks_completed_today || []
    const total_tasks_needed = 4 // Listening, Reading, Writing, Speaking

    if (tasksToday.length === total_tasks_needed) {
      // All tasks completed
      const { data: updatedProgress } = await supabase
        .from("progress")
        .update({
          streak_count: (progress?.streak_count || 0) + 1,
          day_completed: (progress?.day_completed || 0) + 1,
          tasks_completed_today: [],
          last_login: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .select()
        .single()

      return NextResponse.json({
        success: true,
        progress: updatedProgress,
        message: "Streak updated!",
      })
    }

    return NextResponse.json({
      success: false,
      tasksCompleted: tasksToday.length,
      tasksNeeded: total_tasks_needed,
      message: "Complete all tasks to update streak",
    })
  } catch (error) {
    console.error("[v0] Streak update error:", error)
    return NextResponse.json({ error: "Failed to update streak" }, { status: 500 })
  }
}
