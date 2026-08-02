import { NextRequest, NextResponse } from "next/server";
import { getAIProvider } from "@/server/ai";

export async function POST(req: NextRequest) {
  try {
    const { profile } = await req.json();

    if (!profile) {
      return NextResponse.json({ error: "Profile is required" }, { status: 400 });
    }

    const ai = getAIProvider();
    const strategy = await ai.generateStrategy(profile);

    const review = await ai.selfReview(strategy, profile);

    return NextResponse.json({ strategy, review });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to generate strategy";
    console.error("Discovery strategy error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
