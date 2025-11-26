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

    const body = await request.json()

    const { data: response, error } = await supabase
      .from("student_responses")
      .insert({
        student_id: user.id,
        ...body,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, ...updateData } = await request.json()

    const { data: response, error } = await supabase
      .from("student_responses")
      .update(updateData)
      .eq("id", id)
      .eq("student_id", user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
