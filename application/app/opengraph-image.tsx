import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/seo";

export const runtime = "edge";
export const alt = "Khaldoun Alhalabi | Full-Stack Architect & Engineering Leader";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logoUrl = `${siteConfig.url}/sidebar-transparent-256.png`;

export default async function Image() {
  const [interRegular, interBold, spaceGroteskBold] = await Promise.all([
    fetch("https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2").then(
      (res) => res.arrayBuffer(),
    ),
    fetch("https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff2").then(
      (res) => res.arrayBuffer(),
    ),
    fetch("https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj7oUXskPMBBSSJLm2E.woff2").then(
      (res) => res.arrayBuffer(),
    ),
  ]);

  return new ImageResponse(
    (
      <div
        tw="flex flex-col items-start justify-between w-full h-full p-16"
        style={{
          background: "#0b0b0c",
          color: "#ededec",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div tw="flex items-center gap-4">
          <img
            src={logoUrl}
            alt="Khaldoun Alhalabi"
            width="64"
            height="64"
          />
          <span
            tw="text-sm uppercase text-gray-400"
            style={{ letterSpacing: "0.2em", fontFamily: "monospace" }}
          >
            Available for new opportunities
          </span>
        </div>

        <div tw="flex flex-col gap-4 max-w-3xl">
          <h1
            tw="text-7xl font-bold tracking-tight"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Khaldoun Alhalabi
          </h1>
          <p tw="text-3xl text-gray-300">
            Full-Stack Architect & Engineering Leader
          </p>
          <p tw="text-xl text-gray-500 max-w-2xl">
            Building scalable Laravel backends, modern React systems, and
            AI-flavored tooling.
          </p>
        </div>

        <div
          tw="flex items-center gap-4 text-lg text-gray-500"
          style={{ fontFamily: "monospace" }}
        >
          <span>khaldoun.site</span>
          <span tw="text-gray-700">•</span>
          <span>Projects, Experience & Contact</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: interRegular,
          style: "normal",
          weight: 400,
        },
        {
          name: "Inter",
          data: interBold,
          style: "normal",
          weight: 700,
        },
        {
          name: "Space Grotesk",
          data: spaceGroteskBold,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
