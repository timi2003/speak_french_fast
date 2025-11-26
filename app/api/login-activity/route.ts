import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { ip_address, device_info } = await request.json()

    // Check for suspicious activity (multiple different IPs in short time)
    const { data: recentLogins } = await supabase
      .from("login_activity")
      .select("*")
      .eq("user_id", user.id)
      .order("login_time", { ascending: false })
      .limit(5)

    let is_suspicious = false
    if (recentLogins && recentLogins.length > 0) {
      const lastLogin = recentLogins[0]
      if (lastLogin.ip_address !== ip_address) {
        is_suspicious = true
      }
    }

    const { data: activity, error } = await supabase
      .from("login_activity")
      .insert({
        user_id: user.id,
        ip_address,
        device_info,
        is_suspicious,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(activity)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
