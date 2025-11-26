import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ sectionId: string }> }
) {
  try {
    const { sectionId } = await context.params; // ✅ Must await params in Next.js 16

    const supabase = await createClient();

    const { data: section, error } = await supabase
      .from("exam_sections")
      .select(
        `
        *,
        questions (
          id,
          question_text,
          question_number,
          audio_url,
          image_url,
          answer_options (id, option_letter, option_text)
        )
      `
      )
      .eq("id", sectionId)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(section);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
