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

    const { data: slots, error } = await supabase
      .from("exam_slot_availability")
      .select(
        `
        *,
        examiners:examiner_id (first_name, last_name, email),
        exam_bookings (student_id)
      `,
      )
      .gt("end_time", new Date().toISOString())
      .order("start_time", { ascending: true })

    if (error) throw error

    // Filter slots with available capacity
    const availableSlots = slots
      .map((slot: any) => ({
        ...slot,
        availableCapacity: slot.capacity - (slot.exam_bookings?.length || 0),
      }))
      .filter((slot: any) => slot.availableCapacity > 0)

    return NextResponse.json(availableSlots)
  } catch (error) {
    console.error("[GET_EXAM_SCHEDULE]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch schedule" },
      { status: 500 },
    )
  }
}

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
    const { slotId, examId } = body

    if (!slotId || !examId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if slot still has capacity
    const { data: slot, error: slotError } = await supabase
      .from("exam_slot_availability")
      .select("capacity, booked_count")
      .eq("id", slotId)
      .single()

    if (slotError) throw slotError

    if (!slot || slot.booked_count >= slot.capacity) {
      return NextResponse.json({ error: "Slot is full" }, { status: 400 })
    }

    // Check for existing booking
    const { data: existing } = await supabase
      .from("exam_bookings")
      .select("id")
      .eq("student_id", user.id)
      .eq("slot_id", slotId)
      .single()

    if (existing) {
      return NextResponse.json({ error: "Already booked" }, { status: 400 })
    }

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from("exam_bookings")
      .insert({
        student_id: user.id,
        slot_id: slotId,
        exam_id: examId,
        status: "confirmed",
        confirmed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (bookingError) throw bookingError

    // Update slot's booked count
    await supabase
      .from("exam_slot_availability")
      .update({ booked_count: slot.booked_count + 1 })
      .eq("id", slotId)

    return NextResponse.json(booking)
  } catch (error) {
    console.error("[BOOK_EXAM_SLOT]", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to book slot" }, { status: 500 })
  }
}
