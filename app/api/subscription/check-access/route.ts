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

    const { data: userSubscription } = await supabase
      .from("users")
      .select("subscription_plan, subscription_expiry")
      .eq("id", user.id)
      .single()

    if (!userSubscription) {
      return NextResponse.json({
        hasAccess: false,
        reason: "No subscription found",
      })
    }

    const expiryDate = new Date(userSubscription.subscription_expiry)
    const now = new Date()
    const hasAccess = expiryDate > now

    return NextResponse.json({
      hasAccess,
      plan: userSubscription.subscription_plan,
      expiryDate,
      daysLeft: Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
    })
  } catch (error) {
    console.error("[v0] Access check error:", error)
    return NextResponse.json({ error: "Failed to check access" }, { status: 500 })
  }
}
