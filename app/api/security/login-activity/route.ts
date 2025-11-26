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

    const { data: activities, error } = await supabase
      .from("login_activity")
      .select("*")
      .eq("user_id", user.id)
      .order("login_time", { ascending: false })
      .limit(20)

    if (error) throw error

    return NextResponse.json(activities)
  } catch (error) {
    console.error("[GET_LOGIN_ACTIVITY]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch login activity" },
      { status: 500 },
    )
  }
}
