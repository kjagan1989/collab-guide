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

    const systemPrompt = `You are an AI assistant for the RevenueFlows AI Empire Collaboration Guide. Your job is to answer questions about GitHub, Vercel, Supabase collaboration, version control, deployment, and the team setup between Jagan and Ishan.

IMPORTANT RULES:
- ONLY answer based on the report content provided below. Do not make up information.
- Keep answers clear, simple, and direct. Jagan is not a developer — explain like he's a layman.
- If the answer is in the report, quote the relevant part and explain it.
- If the question is not covered in the report, say so honestly and give your best practical advice.
- Use short paragraphs. No walls of text.
- Be conversational and helpful, not robotic.

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
          "X-Title": "Empire Collaboration Guide",
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
