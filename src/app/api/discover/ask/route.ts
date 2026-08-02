import { NextRequest, NextResponse } from "next/server";
import { getAIProvider } from "@/server/ai";
import { getMostMissingFields, calculateConfidence, isPromptSufficient } from "@/server/discovery/confidence-calculator";

export async function POST(req: NextRequest) {
  try {
    const { profile } = await req.json();

    if (!profile) {
      return NextResponse.json({ error: "Profile is required" }, { status: 400 });
    }

    const confidence = calculateConfidence(profile);
    const missingFields = getMostMissingFields(profile);

    if (confidence >= 80 || isPromptSufficient(profile)) {
      return NextResponse.json({
        questions: [],
        confidence,
        complete: true,
      });
    }

    const ai = getAIProvider();
    const questions = await ai.generateQuestions(profile, missingFields);

    return NextResponse.json({
      questions,
      confidence,
      complete: false,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to generate questions";
    console.error("Discovery ask error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
