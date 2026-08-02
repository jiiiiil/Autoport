import { NextRequest, NextResponse } from "next/server";
import { getAIProvider } from "@/server/ai";
import { buildProfileFromPrompt } from "@/server/discovery/profile-builder";
import { calculateConfidence, isPromptSufficient } from "@/server/discovery/confidence-calculator";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 3) {
      return NextResponse.json(
        { error: "Prompt must be at least 3 characters" },
        { status: 400 }
      );
    }

    const ai = getAIProvider();
    const analysis = await ai.analyzePrompt(prompt.trim());

    const profile = buildProfileFromPrompt(prompt.trim(), analysis);

    const deterministic = calculateConfidence(profile);
    const llmConfidence = typeof analysis.confidence === "number" ? analysis.confidence : 0;

    let confidence = Math.max(deterministic, llmConfidence);
    if (isPromptSufficient(profile)) {
      confidence = Math.max(confidence, 85);
    }

    return NextResponse.json({ analysis, profile, confidence });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to analyze prompt";
    console.error("Discovery analyze error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
