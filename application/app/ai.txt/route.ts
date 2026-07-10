import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://khaldoun.site";

  const content = `# AI Agent Access File
# https://ai.txt

Name: Khaldoun Alhalabi
URL: ${siteUrl}
Type: Personal Portfolio
Language: English

# Description
Khaldoun Alhalabi is a full-stack architect and engineering leader specializing
in scalable Laravel backends, modern React/Next.js systems, and AI-flavored
tooling. This site contains a public portfolio, project case studies, work
experience, and contact information.

# Allowed crawlers
Allow: ChatGPT-User
Allow: GPTBot
Allow: Claude-Web
Allow: anthropic-ai
Allow: PerplexityBot
Allow: Google-Extended
Allow: Bytespider
Allow: Diffbot
Allow: meta-externalagent
Allow: OAI-SearchBot
Allow: cohere-ai

# Public content to index
Allow: /
Allow: /projects
Allow: /projects/*
Allow: /experience
Allow: /contact
Allow: /resume.pdf
Allow: /llms.txt
Allow: /sitemap.xml

# Private content — do not index or train on
Disallow: /dashboard
Disallow: /dashboard/*
Disallow: /auth
Disallow: /auth/*
Disallow: /api
Disallow: /api/*
Disallow: /_next

# Context files for AI agents
llms-txt: ${siteUrl}/llms.txt
sitemap: ${siteUrl}/sitemap.xml
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
