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

    // Get current request IP
    const forwarded = request.headers.get("x-forwarded-for")
    const currentIp = forwarded ? forwarded.split(";")[0].trim() : request.headers.get("x-real-ip") || "unknown"

    // Get attempt's initial IP
    const { data: attempt, error: fetchError } = await supabase
      .from("exam_attempts")
      .select("ip_address, status")
      .eq("id", attemptId)
      .eq("student_id", user.id)
      .eq("exam_id", params.id)
      .single()

    if (fetchError || !attempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 })
    }

    // Check if IP changed during exam (potential cheating indicator)
    const ipChanged = attempt.ip_address !== currentIp && attempt.ip_address !== "unknown" && currentIp !== "unknown"

    return NextResponse.json({
      valid: true,
      ipChanged,
      warning: ipChanged ? "Your IP address has changed since starting the exam" : null,
    })
  } catch (error) {
    console.error("[VALIDATE_ATTEMPT]", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Validation failed" }, { status: 500 })
  }
}
