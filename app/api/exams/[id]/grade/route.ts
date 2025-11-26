import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // Next.js 16 — params is async

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { attemptId } = body;

    // Fetch responses with related questions + answer options
    const { data: responses, error: responsesError } = await supabase
      .from("student_responses")
      .select(`
        id,
        question_id,
        selected_answer_id,
        text_response,
        questions (
          id,
          question_type,
          answer_options (id, is_correct)
        )
      `)
      .eq("student_id", user.id)
      .eq("exam_id", id);

    if (responsesError) throw responsesError;

    let correctCount = 0;
    let totalQuestions = 0;

    for (const response of responses) {
      const question = response.questions?.[0]; // FIX: questions is an array

      if (!question) continue; // safety guard

      const { question_type, answer_options } = question;

      // MCQ & short-answer grading
      if (question_type === "mcq" || question_type === "short_answer") {
        totalQuestions++;

        if (response.selected_answer_id) {
          const selectedOption = answer_options?.find(
            (opt: any) => opt.id === response.selected_answer_id
          );

          if (selectedOption?.is_correct) correctCount++;
        }
      }

      // Essay requires manual grading
      if (question_type === "essay") {
        totalQuestions++;
      }
    }

    const scorePercentage =
      totalQuestions > 0
        ? Math.round((correctCount / totalQuestions) * 100)
        : 0;

    const cecrlLevel = calculateCECRLLevel(scorePercentage);

    const { data: updatedAttempt, error: updateError } = await supabase
      .from("exam_attempts")
      .update({
        total_score: scorePercentage,
        cecrl_level: cecrlLevel,
        status: "graded",
      })
      .eq("id", attemptId)
      .eq("student_id", user.id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({
      score: scorePercentage,
      level: cecrlLevel,
      correctAnswers: correctCount,
      totalQuestions,
      attempt: updatedAttempt,
    });
  } catch (error) {
    console.error("[GRADE_EXAM]", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to grade exam",
      },
      { status: 500 }
    );
  }
}

// CECRL level helper
function calculateCECRLLevel(scorePercentage: number): string {
  if (scorePercentage < 20) return "A1";
  if (scorePercentage < 35) return "A2";
  if (scorePercentage < 50) return "B1";
  if (scorePercentage < 70) return "B2";
  if (scorePercentage < 85) return "C1";
  return "C2";
}
