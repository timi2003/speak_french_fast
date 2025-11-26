import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const attemptId = searchParams.get("attemptId")

    if (!attemptId) {
      return NextResponse.json({ error: "Missing attemptId" }, { status: 400 })
    }

    // Fetch exam attempt
    const { data: attempt, error: attemptError } = await supabase
      .from("exam_attempts")
      .select("*")
      .eq("id", attemptId)
      .eq("student_id", user.id)
      .single()

    if (attemptError) throw attemptError

    // Fetch all responses with question details
    const { data: responses, error: responsesError } = await supabase
      .from("student_responses")
      .select(`
        id,
        question_id,
        selected_answer_id,
        text_response,
        exam_section_id,
        questions (
          id,
          question_text,
          question_type,
          difficulty_level,
          answer_options (id, option_letter, option_text, is_correct)
        ),
        exam_sections (
          id,
          title
        )
      `)
      .eq("student_id", user.id)
      .eq("exam_id", params.id)

    if (responsesError) throw responsesError

    // Group responses by section
    const resultsBySection = responses.reduce((acc: any, response: any) => {
      const sectionId = response.exam_section_id
      if (!acc[sectionId]) {
        acc[sectionId] = {
          section: response.exam_sections,
          responses: [],
          correct: 0,
          total: 0,
        }
      }

      const isCorrect =
        response.questions.question_type === "mcq"
          ? response.questions.answer_options.some(
              (opt: any) => opt.id === response.selected_answer_id && opt.is_correct,
            )
          : null

      acc[sectionId].responses.push({
        ...response,
        isCorrect,
      })

      if (response.questions.question_type === "mcq") {
        acc[sectionId].total++
        if (isCorrect) acc[sectionId].correct++
      }

      return acc
    }, {})

    return NextResponse.json({
      attempt,
      resultsBySection,
    })
  } catch (error) {
    console.error("[GET_RESULTS]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch results" },
      { status: 500 },
    )
  }
}
