import { NextRequest, NextResponse } from "next/server";
import { REPORT_CONTENT } from "../../report-content";

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Please provide a question." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI search is not configured. Missing OpenRouter API key." },
        { status: 500 }
      );
    }

    const systemPrompt = `You are an AI assistant for the Ishan & Jagan Collaboration Guide. Jagan and Ishan are two partners who work together using GitHub, Vercel, and Supabase. They both use Claude Code (an AI coding tool).

HOW YOU MUST ANSWER:
- Jagan and Ishan are NOT developers. They don't know technical jargon. Explain everything in plain, simple language.
- NEVER use vague descriptions like "it handles it" or "the system resolves it." Always explain EXACTLY what happens, step by step.
- For every answer, tell them: (1) what happens, (2) what they will see, (3) what they need to do about it.
- Use numbered steps when explaining a process.
- Keep it short but COMPLETE. Don't leave them wondering "ok but what do I actually do?"
- If Claude Code can handle something for them, say that explicitly: "You tell Claude Code to do X, and it does it. You don't have to do anything manually."
- No analogies unless absolutely necessary. Just explain the actual thing.
- You can use knowledge beyond the report when needed to give practical, clear answers. The report is your primary source but you are not limited to it.

REPORT CONTENT:
${REPORT_CONTENT}`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://collab-guide.vercel.app",
          "X-Title": "Ishan Jagan Collaboration Guide",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: question },
          ],
          max_tokens: 1000,
          temperature: 0.3,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter error:", errorText);
      return NextResponse.json(
        { error: "AI service temporarily unavailable. Try again in a moment." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const answer =
      data.choices?.[0]?.message?.content || "Sorry, I couldn't generate an answer. Please try rephrasing your question.";

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Ask API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
