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
import { motion } from "framer-motion";
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
    <div className="relative mt-16 md:mt-20">
      <div className="absolute top-0 left-4 h-full w-px bg-gradient-to-b from-primary-container/40 via-outline-variant to-transparent md:left-1/2 md:-translate-x-1/2" />
      <div className="space-y-6 md:space-y-0">
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
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={cn(
        "relative grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8",
        index > 0 && "md:-mt-8",
      )}
    >
      <div
        className={cn(
          "mx-5 md:mx-0",
          isRight ? "md:col-start-2 md:pl-8" : "md:col-start-1 md:pr-8",
        )}
      >
        <Sheet>
          <SheetTrigger asChild>
            <button
              className={cn(
                "group w-full cursor-pointer rounded-2xl border border-white/6 bg-surface-container-low p-5 text-left shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-primary-container/25 hover:bg-surface-container hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.35)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:p-6",
                isRight ? "md:mt-16" : "md:mt-0",
              )}
              type="button"
            >
              <p
                className={cn(
                  "inline-flex items-center gap-2 rounded-full bg-surface-container-high px-3 py-1 text-xs tracking-[0.2em] uppercase",
                  !!experience.to ? "text-secondary" : "text-primary-container",
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    !!experience.to ? "bg-secondary" : "bg-primary-container",
                  )}
                />
                {experience.from} - {experience.to ?? "Present"}
              </p>
              <h2 className="mt-4 font-heading text-2xl font-bold text-primary transition-colors group-hover:text-primary-container">
                {experience.company_name}
              </h2>
              <p className="mt-2 text-sm tracking-[0.15em] text-on-surface-variant uppercase">
                {experience.position}
              </p>
              {experience.location ? (
                <p className="mt-4 inline-flex items-center gap-2 text-sm text-on-surface-variant">
                  <MapPinIcon className="h-4 w-4 text-secondary" />
                  {experience.location}
                </p>
              ) : null}
              <div className="mt-5 flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-primary-container">
                  View details
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 transition-all duration-300 group-hover:border-primary-container/30 group-hover:bg-primary-container/10">
                  <span className="h-2 w-2 rounded-full bg-secondary transition-transform duration-300 group-hover:scale-125" />
                </span>
              </div>
            </button>
          </SheetTrigger>
          <ExperienceDetailsSheet experience={experience} />
        </Sheet>
      </div>

      <div className="absolute top-8 left-0 flex h-8 w-8 items-center justify-center rounded-full border border-primary-container/30 bg-background md:top-10 md:left-1/2 md:-translate-x-1/2">
        <motion.span
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
          className="h-3.5 w-3.5 rounded-full bg-primary-container shadow-[0_0_22px_rgb(0_245_255/45%)]"
        />
      </div>
    </motion.div>
  );
}

function ExperienceDetailsSheet({ experience }: { experience: Experience }) {
  return (
    <SheetContent
      className="max-h-[90vh] w-full overflow-y-auto rounded-t-3xl border-t border-white/10 bg-background/95 p-0 backdrop-blur-xl data-[side=bottom]:w-full data-[side=bottom]:sm:max-w-none"
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
    <div className="rounded-xl border border-white/6 bg-surface-container-low p-4">
      <div className="flex items-center gap-2 text-secondary">
        {icon}
        <span className="text-xs tracking-[0.2em] uppercase">{label}</span>
      </div>
      <p className="mt-2 text-sm leading-6 text-primary">{value}</p>
    </div>
  );
}
