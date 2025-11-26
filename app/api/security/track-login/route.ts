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
    const forwarded = request.headers.get("x-forwarded-for")
    const ipAddress = forwarded ? forwarded.split(";")[0].trim() : request.headers.get("x-real-ip") || "unknown"

    // Get device info from user agent
    const userAgent = request.headers.get("user-agent") || "unknown"
    const deviceInfo = parseUserAgent(userAgent)

    // Check if this is a new/suspicious IP
    const { data: previousLogins } = await supabase
      .from("login_activity")
      .select("ip_address")
      .eq("user_id", user.id)
      .order("login_time", { ascending: false })
      .limit(5)

    const isSuspicious =
      previousLogins && previousLogins.length > 0 && !previousLogins.some((l) => l.ip_address === ipAddress)

    // Record login activity
    const { error } = await supabase.from("login_activity").insert({
      user_id: user.id,
      ip_address: ipAddress,
      device_info: deviceInfo,
      is_suspicious: isSuspicious,
    })

    if (error) throw error

    return NextResponse.json({
      success: true,
      isSuspicious,
      ipAddress,
    })
  } catch (error) {
    console.error("[TRACK_LOGIN]", error)
    // Don't fail the login if tracking fails
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

function parseUserAgent(userAgent: string): string {
  // Simple parsing - in production, use a library like ua-parser-js
  if (userAgent.includes("Chrome")) return "Chrome"
  if (userAgent.includes("Safari")) return "Safari"
  if (userAgent.includes("Firefox")) return "Firefox"
  if (userAgent.includes("Edge")) return "Edge"
  return "Unknown"
}
