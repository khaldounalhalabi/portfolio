"use client";

import { RichTextContent } from "@/components/portfolio/rich-text-content";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Experience from "@/models/Experience";
import {
  BriefcaseBusinessIcon,
  CalendarDaysIcon,
  ExternalLinkIcon,
  MapPinIcon,
} from "lucide-react";
import type { ReactNode } from "react";

export function ExperienceTimeline({
  experiences,
}: {
  experiences: Experience[];
}) {
  return (
    <div className="relative mt-14">
      <div className="absolute top-0 left-4 h-full w-px bg-outline-variant md:left-1/2 md:-translate-x-1/2" />
      <div className="space-y-8 md:space-y-10">
        {experiences.map((experience, index) => (
          <TimelineItem
            experience={experience}
            index={index}
            key={experience.id}
          />
        ))}
      </div>
    </div>
  );
}

function TimelineItem({
  experience,
  index,
}: {
  experience: Experience;
  index: number;
}) {
  const isRight = index % 2 === 1;

  return (
    <div
      className={cn(
        "relative grid min-h-48 grid-cols-[2rem_1fr] gap-5 md:grid-cols-[1fr_4rem_1fr] md:gap-8",
        index > 0 && "md:-mt-10",
      )}
    >
      <div
        className={cn(
          "md:col-start-1",
          isRight ? "md:col-start-3" : "md:col-start-1",
        )}
      >
        <Sheet>
          <SheetTrigger asChild>
            <button
              className={cn(
                "cursor-pointer group w-full rounded-lg border border-white/6 bg-surface-container-low p-5 text-left shadow-sm transition hover:border-primary-container/35 hover:bg-surface-container focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:p-6",
                isRight ? "md:mt-16" : "md:mt-0",
              )}
              type="button"
            >
              <p
                className={cn(
                  "text-xs tracking-[0.25em] uppercase",
                  !!experience.to
                    ? "text-secondary"
                    : "text-on-surface-variant",
                )}
              >
                {experience.from} - {experience.to ?? "Present"}
              </p>
              <h2 className="mt-4 font-heading text-2xl font-bold text-primary">
                {experience.company_name}
              </h2>
              <p className="mt-2 text-sm tracking-[0.2em] text-on-surface-variant uppercase">
                {experience.position}
              </p>
              {experience.location ? (
                <p className="mt-4 inline-flex items-center gap-2 text-sm text-on-surface-variant">
                  <MapPinIcon className="h-4 w-4 text-secondary" />
                  {experience.location}
                </p>
              ) : null}
              <div className="mt-5 flex items-center justify-between gap-4">
                <span className="hover:underline text-sm font-medium text-primary-container">
                  View details
                </span>
                <span className="h-2 w-2 rounded-full bg-secondary transition group-hover:scale-125" />
              </div>
            </button>
          </SheetTrigger>
          <ExperienceDetailsSheet experience={experience} />
        </Sheet>
      </div>

      <div className="absolute -top-1/2 left-0 flex h-8 w-8 items-center justify-center rounded-full border border-primary-container/30 bg-background md:left-1/2 md:-translate-x-1/2">
        <span className="h-3 w-3 rounded-full bg-primary-container shadow-[0_0_22px_rgb(0_245_255/45%)]" />
      </div>
    </div>
  );
}

function ExperienceDetailsSheet({ experience }: { experience: Experience }) {
  return (
    <SheetContent
      className="max-h-[86vh] w-full overflow-y-auto rounded-t-lg p-0 data-[side=bottom]:w-full data-[side=bottom]:sm:max-w-none"
      side="bottom"
    >
      <SheetHeader className="border-b border-white/8 p-6 pr-14">
        <p className="text-xs tracking-[0.25em] text-secondary uppercase">
          {experience.from} - {experience.to ?? "Present"}
        </p>
        <SheetTitle className="font-heading text-3xl font-bold text-primary">
          {experience.company_name}
        </SheetTitle>
      </SheetHeader>

      <div className="container-shell grid gap-8 py-8 lg:grid-cols-[0.75fr_1.25fr]">
        <aside className="space-y-4">
          <DetailLine
            icon={<BriefcaseBusinessIcon className="h-4 w-4" />}
            label="Role"
            value={experience.position}
          />
          <DetailLine
            icon={<CalendarDaysIcon className="h-4 w-4" />}
            label="Period"
            value={`${experience.from} - ${experience.to ?? "Present"}`}
          />
          {experience.location ? (
            <DetailLine
              icon={<MapPinIcon className="h-4 w-4" />}
              label="Location"
              value={experience.location}
            />
          ) : null}
          {experience.company_website ? (
            <Button asChild className="mt-2 w-full justify-between">
              <a
                href={experience.company_website}
                rel="noreferrer"
                target="_blank"
              >
                Company website
                <ExternalLinkIcon />
              </a>
            </Button>
          ) : null}
        </aside>

        <div className="space-y-8">
          {experience.company_description ? (
            <section>
              <h3 className="font-heading text-xl font-bold text-primary">
                Company
              </h3>
              <RichTextContent
                className="mt-3 text-sm"
                value={experience.company_description}
              />
            </section>
          ) : null}

          <section>
            <h3 className="font-heading text-xl font-bold text-primary">
              Work
            </h3>
            <RichTextContent
              className="mt-3 text-sm"
              value={experience.job_description}
            />
          </section>
        </div>
      </div>
    </SheetContent>
  );
}

function DetailLine({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/6 bg-surface-container-low p-4">
      <div className="flex items-center gap-2 text-secondary">
        {icon}
        <span className="text-xs tracking-[0.2em] uppercase">{label}</span>
      </div>
      <p className="mt-2 text-sm leading-6 text-primary">{value}</p>
    </div>
  );
}
