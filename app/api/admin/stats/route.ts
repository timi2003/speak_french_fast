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

    // Verify admin role
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get stats
    const { count: totalStudents } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "student")

    const { count: totalAttempts } = await supabase.from("exam_attempts").select("*", { count: "exact", head: true })

    const { count: completedAttempts } = await supabase
      .from("exam_attempts")
      .select("*", { count: "exact", head: true })
      .eq("status", "graded")

    const { data: scores } = await supabase
      .from("exam_attempts")
      .select("total_score")
      .eq("status", "graded")
      .gt("total_score", 0)

    const averageScore =
      scores && scores.length > 0
        ? Math.round(scores.reduce((sum, a) => sum + (a.total_score || 0), 0) / scores.length)
        : 0

    return NextResponse.json({
      totalStudents: totalStudents || 0,
      totalAttempts: totalAttempts || 0,
      completedAttempts: completedAttempts || 0,
      averageScore,
    })
  } catch (error) {
    console.error("[GET_STATS]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch stats" },
      { status: 500 },
    )
  }
}
