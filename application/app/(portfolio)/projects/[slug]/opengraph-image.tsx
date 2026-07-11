import { ImageResponse } from "next/og";

import ProjectService from "@/services/ProjectService";
import { createClient } from "@/lib/supabase/server";
import Project from "@/models/Project";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const project = (await ProjectService.make()
    .setClient(supabase)
    .show(slug, undefined, "slug")) as Project | null;

  if (!project) {
    return new ImageResponse(
      (
        <div
          tw="flex flex-col items-start justify-center w-full h-full p-16"
          style={{
            background: "#0b0b0c",
            color: "#ededec",
          }}
        >
          <h1 tw="text-6xl font-bold">Project Not Found</h1>
        </div>
      ),
      { ...size },
    );
  }

  const title = project.title;
  const category = project.category;
  const role = project.role || "Lead Full-Stack Architect";
  const year = project.year || "2024";
  const tags = (project.tags ?? []).slice(0, 4);

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
        <div tw="flex items-center gap-3">
          <span
            tw="text-sm uppercase text-gray-400"
            style={{ letterSpacing: "0.2em", fontFamily: "monospace" }}
          >
            {category}
          </span>
          {project.featured && (
            <span
              tw="text-sm uppercase text-gray-500"
              style={{ letterSpacing: "0.2em", fontFamily: "monospace" }}
            >
              • Featured
            </span>
          )}
        </div>

        <div tw="flex flex-col gap-4 max-w-4xl">
          <h1
            tw="text-6xl font-bold tracking-tight"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            {title}
          </h1>
          <p tw="text-2xl text-gray-400">
            {role} • {year}
          </p>
          {tags.length > 0 && (
            <div tw="flex flex-wrap gap-3 mt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  tw="px-4 py-1.5 border border-white/15 text-gray-300 text-lg"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div tw="flex items-center gap-4 text-lg text-gray-500">
          <span>Khaldoun Alhalabi</span>
          <span tw="text-gray-700">•</span>
          <span>khaldoun.site/projects/{project.slug}</span>
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
