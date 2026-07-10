import { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://khaldoun.site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/auth", "/api", "/_next"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/dashboard", "/auth", "/api"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/",
        disallow: ["/dashboard", "/auth", "/api"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/dashboard", "/auth", "/api"],
      },
      // AI agents and LLM crawlers — allowed on public portfolio content
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: ["/dashboard", "/auth", "/api"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/dashboard", "/auth", "/api"],
      },
      {
        userAgent: "Claude-Web",
        allow: "/",
        disallow: ["/dashboard", "/auth", "/api"],
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: ["/dashboard", "/auth", "/api"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/dashboard", "/auth", "/api"],
      },
      {
        userAgent: "Perplexity-User",
        allow: "/",
        disallow: ["/dashboard", "/auth", "/api"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/dashboard", "/auth", "/api"],
      },
      {
        userAgent: "Bytespider",
        allow: "/",
        disallow: ["/dashboard", "/auth", "/api"],
      },
      {
        userAgent: "Diffbot",
        allow: "/",
        disallow: ["/dashboard", "/auth", "/api"],
      },
      {
        userAgent: "meta-externalagent",
        allow: "/",
        disallow: ["/dashboard", "/auth", "/api"],
      },
      {
        userAgent: "Meta-ExternalFetcher",
        allow: "/",
        disallow: ["/dashboard", "/auth", "/api"],
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: ["/dashboard", "/auth", "/api"],
      },
      {
        userAgent: "Amazonbot",
        allow: "/",
        disallow: ["/dashboard", "/auth", "/api"],
      },
      {
        userAgent: "Applebot",
        allow: "/",
        disallow: ["/dashboard", "/auth", "/api"],
      },
      {
        userAgent: "Applebot-Extended",
        allow: "/",
        disallow: ["/dashboard", "/auth", "/api"],
      },
      {
        userAgent: "YouBot",
        allow: "/",
        disallow: ["/dashboard", "/auth", "/api"],
      },
      {
        userAgent: "cohere-ai",
        allow: "/",
        disallow: ["/dashboard", "/auth", "/api"],
      },
      {
        userAgent: "cohere-training-data-crawler",
        allow: "/",
        disallow: ["/dashboard", "/auth", "/api"],
      },
      {
        userAgent: "Webzio",
        allow: "/",
        disallow: ["/dashboard", "/auth", "/api"],
      },
      {
        userAgent: "facebookexternalhit",
        allow: "/",
        disallow: ["/dashboard", "/auth", "/api"],
      },
      {
        userAgent: "Twitterbot",
        allow: "/",
        disallow: ["/dashboard", "/auth", "/api"],
      },
      {
        userAgent: "LinkedInBot",
        allow: "/",
        disallow: ["/dashboard", "/auth", "/api"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
