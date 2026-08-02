"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { MessageBubble } from "./message-bubble";
import { ConfidenceIndicator } from "./confidence-indicator";
import { FadeIn } from "@/components/common/fade-in";
import { useDiscoveryStore } from "@/lib/discovery-store";
import { useAppStore } from "@/lib/store";
import { Sparkles, Brain, ChevronLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DiscoveryQuestion } from "@/server/discovery/types";

const now = () => Date.now();

export function DiscoveryChat() {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [answering, setAnswering] = useState(false);
  const startedRef = useRef(false);

  const {
    stage, setStage,
    prompt,
    profile, setProfile,
    messages, addMessage,
    activeQuestions, setActiveQuestions,
    confidence, setConfidence,
    strategy, setStrategy,
    setReview,
    reset,
  } = useDiscoveryStore();

  const { setGenerationTriggered } = useAppStore();

  const proceedToStrategy = useCallback(async (autoGenerate = false) => {
    setStage("strategizing");
    addMessage({
      id: `ai-strategy-${now()}`,
      role: "ai",
      content: "Analyzing your profile and designing your unique portfolio strategy...",
      timestamp: now(),
    });

    try {
      const res = await fetch("/api/discover/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });

      if (!res.ok) throw new Error("Strategy generation failed");

      const data = await res.json();
      setStrategy(data.strategy);
      setReview(data.review);
    } catch {
      addMessage({
        id: `ai-strategy-error-${now()}`,
        role: "ai",
        content: "I had trouble generating your strategy. Let's proceed with what we have.",
        timestamp: now(),
      });
    }

    if (autoGenerate) {
      setStage("generating");
      addMessage({
        id: `ai-launch-${now()}`,
        role: "ai",
        content: "I have enough information. Building your portfolio now — no questions needed.",
        timestamp: now(),
      });
      setGenerationTriggered(true);
      setTimeout(() => {
        router.push("/generation");
      }, 500);
      return;
    }

    setStage("strategy-ready");
    addMessage({
      id: `ai-strategy-done-${now()}`,
      role: "ai",
      content: "Your portfolio strategy is ready! Review it below and click Generate when you're happy.",
      timestamp: now(),
    });
  }, [profile, addMessage, setReview, setStage, setStrategy, setGenerationTriggered, router]);

  const askNextQuestions = useCallback(async () => {
    setStage("questioning");
    try {
      const res = await fetch("/api/discover/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });

      if (!res.ok) throw new Error("Failed to generate questions");

      const data = await res.json();
      setConfidence(data.confidence);

      if (data.complete || data.confidence >= 80) {
        addMessage({
          id: `ai-complete-${now()}`,
          role: "ai",
          content: "I now have enough information to design your portfolio! Let me create your strategy.",
          timestamp: now(),
        });
        await proceedToStrategy();
        return;
      }

      if (data.questions && data.questions.length > 0) {
        setActiveQuestions(data.questions);
        addMessage({
          id: `ai-questions-${now()}`,
          role: "ai",
          content: data.questions.length === 1
            ? "I have one more question:"
            : "I have a few more questions:",
          questions: data.questions,
          timestamp: now(),
        });
      }
    } catch {
      const fallbackQ = getFallbackQuestions();
      setActiveQuestions(fallbackQ);
      addMessage({
        id: `ai-questions-fallback-${now()}`,
        role: "ai",
        content: "Let me ask you a few questions to understand you better.",
        questions: fallbackQ,
        timestamp: now(),
      });
    }
  }, [profile, addMessage, proceedToStrategy, setActiveQuestions, setConfidence, setStage]);

  const startAnalysis = useCallback(async () => {
    if (!prompt.trim() || startedRef.current) return;
    startedRef.current = true;

    setStage("analyzing");
    addMessage({
      id: "ai-analyzing",
      role: "ai",
      content: "Let me analyze your prompt to understand what I know and what I need to learn about you...",
      timestamp: now(),
    });

    try {
      const res = await fetch("/api/discover/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error("Analysis failed");

      const result = await res.json();
      const analysis = result.analysis;
      const profile = result.profile || {};
      const confidence = result.confidence ?? analysis?.confidence ?? 0;

      setConfidence(confidence);
      setProfile(profile);

      const known = analysis?.known || {};
      const knownFields = Object.keys(known).filter((k: string) => {
        const v = known[k];
        if (Array.isArray(v)) return v.length > 0;
        return Boolean(v);
      });

      const knownSummary = knownFields.length > 0
        ? `I can see: ${knownFields.join(", ")}.`
        : "";
      const missingSummary = (analysis?.missing || []).length > 0
        ? `I need to learn more about: ${analysis.missing.slice(0, 5).join(", ")}.`
        : "";

      addMessage({
        id: `ai-analysis-${now()}`,
        role: "ai",
        content: `I've analyzed your prompt. My confidence is at **${confidence}%**. ${knownSummary} ${missingSummary}`,
        timestamp: now(),
      });

      if (confidence >= 80) {
        await proceedToStrategy(true);
      } else {
        await askNextQuestions();
      }
    } catch {
      addMessage({
        id: "ai-error",
        role: "ai",
        content: "I had trouble analyzing your prompt. Let me ask you directly — tell me about yourself.",
        timestamp: now(),
      });
      setStage("questioning");
      const defaultQuestions = getFallbackQuestions();
      setActiveQuestions(defaultQuestions);
      addMessage({
        id: `ai-questions-${now()}`,
        role: "ai",
        content: "Let's start from the beginning.",
        questions: defaultQuestions,
        timestamp: now(),
      });
    }
  }, [prompt, addMessage, askNextQuestions, proceedToStrategy, setActiveQuestions, setConfidence, setProfile, setStage]);

  const handleAnswer = useCallback(async (questionId: string, answer: string | string[]) => {
    if (answering) return;
    setAnswering(true);

    const question = activeQuestions.find((q) => q.id === questionId);
    if (!question) {
      setAnswering(false);
      return;
    }

    const answerText = Array.isArray(answer) ? answer.join(", ") : answer;
    addMessage({
      id: `user-${now()}`,
      role: "user",
      content: answerText,
      timestamp: now(),
    });

    setActiveQuestions([]);

    try {
      const res = await fetch("/api/discover/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, question, answer }),
      });

      if (!res.ok) throw new Error("Failed to process answer");

      const data = await res.json();
      setProfile(data.profile);
      setConfidence(data.confidence);

      await askNextQuestions();
    } catch {
      const updatedProfile = { ...profile, [question.field]: Array.isArray(answer) ? answer : answer };
      setProfile(updatedProfile);
      setConfidence(Math.min(confidence + 15, 100));

      await askNextQuestions();
    }

    setAnswering(false);
  }, [activeQuestions, profile, answering, askNextQuestions, confidence, addMessage, setActiveQuestions, setConfidence, setProfile]);

  const handleGenerate = useCallback(() => {
    setGenerationTriggered(true);
    setTimeout(() => {
      router.push("/generation");
    }, 600);
  }, [router, setGenerationTriggered]);

  const handleBack = useCallback(() => {
    reset();
    startedRef.current = false;
  }, [reset]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (prompt && !startedRef.current) {
      startAnalysis();
    }
  }, []);

  const starterQuestions = useMemo<DiscoveryQuestion[]>(
    () => [
      {
        id: "starter-role",
        text: "What role are you targeting?",
        type: "choice",
        field: "role",
        options: [
          { label: "Frontend Developer", value: "Frontend Developer" },
          { label: "Backend Developer", value: "Backend Developer" },
          { label: "Full Stack Developer", value: "Full Stack Developer" },
          { label: "AI/ML Engineer", value: "AI/ML Engineer" },
          { label: "UI/UX Designer", value: "UI/UX Designer" },
          { label: "DevOps Engineer", value: "DevOps Engineer" },
          { label: "Data Scientist", value: "Data Scientist" },
          { label: "Product Designer", value: "Product Designer" },
        ],
      },
      {
        id: "starter-exp",
        text: "How many years of experience do you have?",
        type: "choice",
        field: "experience",
        options: [
          { label: "< 1 year", value: "entry" },
          { label: "1-3 years", value: "junior" },
          { label: "3-5 years", value: "mid" },
          { label: "5-8 years", value: "senior" },
          { label: "8+ years", value: "lead" },
        ],
      },
      {
        id: "starter-skills",
        text: "What are your top skills or technologies?",
        type: "multiselect",
        field: "skills",
        options: [
          { label: "React", value: "React" },
          { label: "Next.js", value: "Next.js" },
          { label: "TypeScript", value: "TypeScript" },
          { label: "Node.js", value: "Node.js" },
          { label: "Python", value: "Python" },
          { label: "Tailwind CSS", value: "Tailwind CSS" },
          { label: "Figma", value: "Figma" },
          { label: "PostgreSQL", value: "PostgreSQL" },
          { label: "MongoDB", value: "MongoDB" },
          { label: "AWS", value: "AWS" },
          { label: "Docker", value: "Docker" },
          { label: "GraphQL", value: "GraphQL" },
        ],
      },
    ],
    []
  );

  return (
    <section className="relative w-full min-h-screen bg-bg-dark">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(124,58,237,0.06)_0%,_transparent_60%)]" />
      <div className="relative mx-auto max-w-3xl px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-white transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to prompt
        </button>

        <div className="flex flex-col gap-1 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Portfolio Discovery
          </h1>
          <p className="text-text-muted text-sm">
            Confidence: <span className={cn("font-medium", confidence >= 80 ? "text-green-400" : confidence >= 50 ? "text-yellow-400" : "text-red-400")}>{confidence}%</span>
          </p>
          <ConfidenceIndicator confidence={confidence} className="max-w-xs" />
        </div>

        <div className="space-y-5">
          {messages.map((msg) => (
            <FadeIn key={msg.id} y={10}>
              <MessageBubble
                message={msg}
                onAnswer={handleAnswer}
                answering={answering}
              />
            </FadeIn>
          ))}

          {stage === "analyzing" && !messages.some((m) => m.id === "ai-analysis") && (
            <div className="flex items-center gap-3 text-text-muted text-sm">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              Analyzing your prompt...
            </div>
          )}

          {stage === "strategizing" && (
            <div className="flex items-center gap-3 text-text-muted text-sm">
              <Brain className="w-4 h-4 animate-pulse text-primary" />
              Designing your unique portfolio strategy...
            </div>
          )}

          {stage === "generating" && (
            <div className="flex items-center gap-3 text-text-muted text-sm">
              <Sparkles className="w-4 h-4 animate-pulse text-primary" />
              Launching portfolio generation...
            </div>
          )}

          {stage === "questioning" && messages.length === 1 && (
            <div className="flex flex-col items-center gap-4 pt-4">
              <p className="text-text-muted text-sm">Let me ask you a few questions to get started.</p>
              <div className="space-y-2 w-full max-w-md">
                {starterQuestions.slice(0, 2).map((q) => (
                  <MessageBubble
                    key={q.id}
                    message={{
                      id: `ai-starter-${q.id}`,
                      role: "ai",
                      content: q.text,
                      questions: [q],
                      timestamp: now(),
                    }}
                    onAnswer={handleAnswer}
                    answering={answering}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {stage === "strategy-ready" && strategy && (
          <StrategyPreview
            strategy={strategy}
            onGenerate={handleGenerate}
            onBack={handleBack}
          />
        )}
      </div>
    </section>
  );
}

function StrategyPreview({
  strategy,
  onGenerate,
  onBack,
}: {
  strategy: NonNullable<ReturnType<typeof useDiscoveryStore.getState>["strategy"]>;
  onGenerate: () => void;
  onBack: () => void;
}) {
  const [generating, setGenerating] = useState(false);

  const handleGenerateClick = () => {
    setGenerating(true);
    onGenerate();
  };

  return (
    <FadeIn y={20} delay={0.3}>
      <div className="mt-16 rounded-2xl bg-bg-card border border-white/[0.06] shadow-2xl overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-white">Portfolio Strategy Ready</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <StrategyItem label="Style" value={strategy.style} />
            <StrategyItem label="Theme" value={strategy.theme} />
            <StrategyItem label="Typography" value={`${strategy.typography.heading} / ${strategy.typography.body}`} />
            <StrategyItem label="Layout" value={strategy.layout} />
            <StrategyItem label="Animation" value={strategy.animation} />
            <StrategyItem label="Sections" value={`${strategy.sections} sections`} />
            <StrategyItem label="Audience" value={strategy.audience} />
            <StrategyItem label="Est. Build" value={strategy.estimatedBuildTime} />
            <StrategyItem label="Design Lang" value={strategy.designLanguage} />
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-white mb-2">Color Palette</h3>
            <div className="flex gap-2">
              {strategy.colorPalette.map((color, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-lg border border-white/10"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-white mb-2">Storytelling Flow</h3>
            <div className="flex flex-wrap gap-2">
              {strategy.storytellingFlow.map((step, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 text-xs text-text-muted"
                >
                  {i > 0 && <span className="text-primary/40">→</span>}
                  {step}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-medium text-white mb-2">Components</h3>
            <div className="flex flex-wrap gap-2">
              {strategy.componentTree.map((comp, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary"
                >
                  {comp}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerateClick}
              disabled={generating}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary-hover transition-all duration-200 shadow-[0_0_20px_rgba(124,58,237,0.3)]"
            >
              {generating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {generating ? "Generating..." : "Generate Portfolio"}
            </button>
            <button
              onClick={onBack}
              disabled={generating}
              className="px-6 py-3 rounded-xl border border-white/10 text-text-muted text-sm hover:text-white transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

function StrategyItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-text-muted text-xs mb-1">{label}</p>
      <p className="text-white text-sm font-medium">{value}</p>
    </div>
  );
}

function getFallbackQuestions(): DiscoveryQuestion[] {
  return [
    {
      id: "fallback-role",
      text: "What role or title describes you best?",
      type: "choice",
      field: "role",
      options: [
        { label: "Frontend Developer", value: "Frontend Developer" },
        { label: "Full Stack Developer", value: "Full Stack Developer" },
        { label: "AI Engineer", value: "AI Engineer" },
        { label: "UI/UX Designer", value: "UI/UX Designer" },
        { label: "Other", value: "Other" },
      ],
    },
    {
      id: "fallback-exp",
      text: "How many years of professional experience do you have?",
      type: "choice",
      field: "experience",
      options: [
        { label: "< 1 year", value: "entry" },
        { label: "1-3 years", value: "junior" },
        { label: "3-5 years", value: "mid" },
        { label: "5+ years", value: "senior" },
      ],
    },
    {
      id: "fallback-design",
      text: "What design style resonates with you?",
      type: "choice",
      field: "designPreference",
      options: [
        { label: "Minimal & Clean", value: "minimal" },
        { label: "Dark & Cyberpunk", value: "cyberpunk" },
        { label: "Luxury & Premium", value: "luxury" },
        { label: "Playful & Creative", value: "playful" },
        { label: "Corporate & Professional", value: "corporate" },
      ],
    },
  ];
}
