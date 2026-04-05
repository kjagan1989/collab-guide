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
- Jagan and Ishan are NOT developers. No jargon. Plain language only.
- Every answer has TWO parts only: (1) What's the problem / what's happening. (2) How to fix it / what to do. That's it.
- Keep answers to 3-5 sentences MAX. Only go longer if the question truly requires steps.
- If Claude Code handles it, just say "Tell Claude Code to [do X]. It handles the rest."
- Never explain HOW things work internally unless they specifically ask. Just tell them what to do.
- No analogies. No technical deep dives. No explaining Git internals.
- Tone: direct, confident, like a teammate giving a quick answer on Slack.

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
