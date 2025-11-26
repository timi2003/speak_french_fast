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
    const { plan_type } = body

    if (!["free", "1-month", "3-month"].includes(plan_type)) {
      return NextResponse.json({ error: "Invalid plan type" }, { status: 400 })
    }

    // Calculate expiry date based on plan
    const expiryDate = new Date()
    if (plan_type === "1-month") {
      expiryDate.setMonth(expiryDate.getMonth() + 1)
    } else if (plan_type === "3-month") {
      expiryDate.setMonth(expiryDate.getMonth() + 3)
    } else {
      expiryDate.setHours(expiryDate.getHours() + 48)
    }

    // Update user subscription
    const { error: userError } = await supabase
      .from("users")
      .update({
        subscription_plan: plan_type,
        subscription_expiry: expiryDate.toISOString(),
      })
      .eq("id", user.id)

    if (userError) throw userError

    // Update or create subscription record
    const { error: subError } = await supabase
      .from("subscriptions")
      .upsert({
        user_id: user.id,
        plan_type,
        expiry_date: expiryDate.toISOString(),
      })
      .eq("user_id", user.id)

    if (subError) throw subError

    return NextResponse.json({
      success: true,
      plan_type,
      expiry_date: expiryDate.toISOString(),
    })
  } catch (error) {
    console.error("[v0] Subscription error:", error)
    return NextResponse.json({ error: "Failed to upgrade subscription" }, { status: 500 })
  }
}
