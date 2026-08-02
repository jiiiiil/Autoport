import { NextRequest, NextResponse } from "next/server";
import { getAIProvider } from "@/server/ai";
import { updateProfile } from "@/server/discovery/profile-builder";
import { calculateConfidence } from "@/server/discovery/confidence-calculator";
import type { DiscoveryQuestion, UserProfile } from "@/server/discovery/types";

export async function POST(req: NextRequest) {
  try {
    const { profile, question, answer } = await req.json();

    if (!profile || !question || answer === undefined) {
      return NextResponse.json(
        { error: "Profile, question, and answer are required" },
        { status: 400 }
      );
    }

    let updatedProfile: Partial<UserProfile>;

    try {
      const ai = getAIProvider();
      updatedProfile = await ai.processAnswer(profile, question as DiscoveryQuestion, answer as string | string[]);
    } catch {
      updatedProfile = updateProfile(profile, question as DiscoveryQuestion, answer as string | string[]);
    }

    const confidence = calculateConfidence(updatedProfile);

    return NextResponse.json({
      profile: updatedProfile,
      confidence,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to process answer";
    console.error("Discovery answer error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
