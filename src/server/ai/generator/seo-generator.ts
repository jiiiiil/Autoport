import type { GeneratorContext, GeneratedFile } from "./types";

export function generateSeoFiles(ctx: GeneratorContext): GeneratedFile[] {
  const { manifest } = ctx;
  const seo = manifest.blueprint.seo;
  const a11y = manifest.blueprint.accessibility;

  const metadataFile: GeneratedFile = {
    path: `${ctx.libDir}/seo.ts`,
    content: `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "${seo.title}",
    template: "%s | ${seo.title}",
  },
  description: "${seo.description}",
  keywords: ${JSON.stringify(seo.keywords)},
  authors: [{ name: "${manifest.projectManifest.name}" }],
  creator: "${manifest.projectManifest.name}",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "${seo.canonical}",
    title: "${seo.openGraph.title}",
    description: "${seo.openGraph.description}",
    siteName: "${seo.title}",
  },
  twitter: {
    card: "${seo.twitter.card}",
    title: "${seo.twitter.title}",
    description: "${seo.twitter.description}",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "${seo.canonical}",
  },
};
`,
    type: "seo",
  };

  const sitemapFile: GeneratedFile = {
    path: `${ctx.publicDir}/sitemap.xml`,
    content: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${seo.canonical}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`,
    type: "seo",
  };

  const robotsFile: GeneratedFile = {
    path: `${ctx.publicDir}/robots.txt`,
    content: `User-agent: *
Allow: /
Sitemap: ${seo.canonical}/sitemap.xml
`,
    type: "seo",
  };

  const structuredData: GeneratedFile = {
    path: `${ctx.libDir}/structured-data.ts`,
    content: `export function getPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "${manifest.projectManifest.name}",
    jobTitle: "${manifest.blueprint.portfolioType}",
    url: "${seo.canonical}",
    sameAs: [
      "${manifest.blueprint.content.sections?.contact?.data?.social?.github || "https://github.com"}",
      "${manifest.blueprint.content.sections?.contact?.data?.social?.linkedin || "https://linkedin.com"}",
      "${manifest.blueprint.content.sections?.contact?.data?.social?.twitter || "https://twitter.com"}",
    ],
  };
}

export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "${seo.title}",
    description: "${seo.description}",
    url: "${seo.canonical}",
  };
}
`,
    type: "seo",
  };

  return [metadataFile, sitemapFile, robotsFile, structuredData];
}
