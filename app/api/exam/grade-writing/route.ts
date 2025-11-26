import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { essay, question } = body

    if (!essay || !question) {
      return NextResponse.json({ error: "Missing essay or question" }, { status: 400 })
    }

    const { text: feedback } = await generateText({
      model: "openai/gpt-4-mini",
      prompt: `You are an expert French language teacher grading a student's written essay for a TEF/TCF exam.

Question: ${question}

Student's Essay:
${essay}

Please provide:
1. Overall Score (out of 100)
2. Grammar Errors (list specific errors)
3. Vocabulary Assessment (quality and appropriateness)
4. Structure & Organization (quality of arguments and flow)
5. Key Strengths (2-3 main strengths)
6. Areas for Improvement (2-3 main areas to work on)
7. Specific Suggestions (actionable tips for better writing)

Format your response as a structured evaluation.`,
      maxOutputTokens: 500, //  FINAL FIX
    })

    const scoreMatch = feedback.match(/(\d+)/)
    const score = scoreMatch ? Number.parseInt(scoreMatch[1]) : 0

    return NextResponse.json({
      score: Math.min(100, Math.max(0, score)),
      feedback,
      analysis: {
        grammar: extractSection(feedback, "Grammar"),
        vocabulary: extractSection(feedback, "Vocabulary"),
        structure: extractSection(feedback, "Structure"),
        strengths: extractSection(feedback, "Strengths"),
        improvements: extractSection(feedback, "Improvement"),
        suggestions: extractSection(feedback, "Suggestions"),
      },
    })
  } catch (error) {
    console.error("[v0] Essay grading error:", error)
    return NextResponse.json({ error: "Failed to grade essay" }, { status: 500 })
  }
}

function extractSection(text: string, section: string): string {
  const regex = new RegExp(`${section}[^:]*:(.+?)(?=\\d+\\.|$)`, "is")
  const match = text.match(regex)
  return match ? match[1].trim() : ""
}
