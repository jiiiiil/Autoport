import type { AIContextObject } from "../intelligence/types";
import type { SEOPlan } from "./types";

export function planSEO(context: AIContextObject): SEOPlan {
  const name = context.rawPrompt.match(/(?:I'm|I am|my name is|call me)\s+(\w+(?:\s+\w+)?)/i)?.[1] ?? "Developer";
  const role = context.profession.replace(/-/g, " ");

  const title = `${name} - ${role} Portfolio`;
  const description = context.intent.portfolioGoal ||
    `Portfolio of ${name}, a ${role} building exceptional digital products.`;

  const keywords = [
    ...context.rawExtraction.technologies,
    ...context.rawExtraction.libraries,
    role,
    name,
    "portfolio",
    "developer",
  ].filter((v, i, a) => a.indexOf(v) === i);

  const structuredData: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name,
      jobTitle: role,
      description,
      knowsAbout: keywords.slice(0, 10),
    },
  ];

  if (context.profession === "agency" || context.profession === "startup") {
    structuredData.push({
      "@context": "https://schema.org",
      "@type": "Organization",
      name,
      description,
    });
  }

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      image: "/og-image.png",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    structuredData,
    canonical: context.rawExtraction.urls[0] ?? "",
    robots: "index, follow",
  };
}
