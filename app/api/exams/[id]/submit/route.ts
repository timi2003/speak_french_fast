import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { attemptId } = body

    if (!attemptId) {
      return NextResponse.json({ error: "Missing attemptId" }, { status: 400 })
    }

    // Verify this is the user's attempt
    const { data: attempt, error: fetchError } = await supabase
      .from("exam_attempts")
      .select("*")
      .eq("id", attemptId)
      .eq("student_id", user.id)
      .eq("exam_id", params.id)
      .single()

    if (fetchError || !attempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 })
    }

    // Update attempt status to submitted
    const { error: updateError } = await supabase
      .from("exam_attempts")
      .update({
        status: "submitted",
        end_time: new Date().toISOString(),
      })
      .eq("id", attemptId)

    if (updateError) throw updateError

    // Trigger grading logic
    const gradeResponse = await fetch(new URL(`/api/exams/${params.id}/grade`, request.url), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ attemptId }),
    })

    const gradeResult = await gradeResponse.json()

    return NextResponse.json({
      success: true,
      attemptId,
      ...gradeResult,
    })
  } catch (error) {
    console.error("[SUBMIT_EXAM]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to submit exam" },
      { status: 500 },
    )
  }
}
