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
import Experience from "@/models/Experience";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
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
    <div className="mt-16 border-t border-border">
      {experiences.map((experience, index) => (
        <TimelineItem
          experience={experience}
          index={index}
          total={experiences.length}
          key={experience.id}
        />
      ))}
    </div>
  );
}

function TimelineItem({
  experience,
  index,
  total,
}: {
  experience: Experience;
  index: number;
  total: number;
}) {
  const isCurrent = !experience.to;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="border-b border-border"
    >
      <Sheet>
        <SheetTrigger asChild>
          <button
            type="button"
            className="group grid w-full cursor-pointer grid-cols-1 gap-4 py-8 text-left transition-colors md:grid-cols-[6rem_1fr_auto] md:items-baseline md:gap-8 md:py-10"
          >
            <span className="font-mono text-xs text-muted-foreground tabular-nums">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </span>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-heading text-2xl font-semibold text-foreground transition-colors md:text-3xl">
                  {experience.company_name}
                </h2>
                {isCurrent && (
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                    Present
                  </span>
                )}
              </div>
              <p className="mt-2 font-mono text-sm text-muted-foreground">
                {experience.position}
              </p>
              {experience.location ? (
                <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPinIcon className="h-3.5 w-3.5" />
                  {experience.location}
                </p>
              ) : null}
            </div>

            <div className="flex items-center gap-6 md:justify-end">
              <span className="font-mono text-xs text-muted-foreground whitespace-nowrap tabular-nums">
                {experience.from} — {experience.to ?? "Now"}
              </span>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
            </div>
          </button>
        </SheetTrigger>
        <ExperienceDetailsSheet experience={experience} />
      </Sheet>
    </motion.div>
  );
}

function ExperienceDetailsSheet({ experience }: { experience: Experience }) {
  return (
    <SheetContent
      className="max-h-[90vh] w-full overflow-y-auto border-t border-border bg-background p-0 data-[side=bottom]:w-full data-[side=bottom]:sm:max-w-none"
      side="bottom"
    >
      <SheetHeader className="border-b border-border p-6 pr-14 md:px-10">
        <p className="font-mono text-xs tracking-wide text-muted-foreground">
          {experience.from} — {experience.to ?? "Present"}
        </p>
        <SheetTitle className="font-heading text-3xl font-semibold text-foreground">
          {experience.company_name}
        </SheetTitle>
      </SheetHeader>

      <div className="container-shell grid gap-10 py-10 lg:grid-cols-[0.7fr_1.3fr]">
        <aside className="space-y-3">
          <DetailLine
            icon={<BriefcaseBusinessIcon className="h-4 w-4" />}
            label="Role"
            value={experience.position}
          />
          <DetailLine
            icon={<CalendarDaysIcon className="h-4 w-4" />}
            label="Period"
            value={`${experience.from} — ${experience.to ?? "Present"}`}
          />
          {experience.location ? (
            <DetailLine
              icon={<MapPinIcon className="h-4 w-4" />}
              label="Location"
              value={experience.location}
            />
          ) : null}
          {experience.company_website ? (
            <Button
              asChild
              variant="outline"
              className="mt-2 w-full justify-between rounded-none"
            >
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
              <h3 className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
                Company
              </h3>
              <RichTextContent
                className="mt-3 text-sm"
                value={experience.company_description}
              />
            </section>
          ) : null}

          <section>
            <h3 className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
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
    <div className="border border-border p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="font-mono text-[10px] tracking-wide uppercase">
          {label}
        </span>
      </div>
      <p className="mt-2 text-sm leading-6 text-foreground">{value}</p>
    </div>
  );
}
