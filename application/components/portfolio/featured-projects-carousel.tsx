"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { ProjectMedia } from "@/components/portfolio/project-media";
import Project from "@/models/Project";

interface FeaturedProjectsCarouselProps {
  projects: Project[];
}

const SLIDE_DURATION_MS = 6000;

export function FeaturedProjectsCarousel({
  projects,
}: FeaturedProjectsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      setCurrentIndex((previous) => {
        const next = previous + newDirection;
        if (next < 0) return projects.length - 1;
        if (next >= projects.length) return 0;
        return next;
      });
    },
    [projects.length],
  );

  useEffect(() => {
    if (projects.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      paginate(1);
    }, SLIDE_DURATION_MS);

    return () => clearInterval(interval);
  }, [paginate, projects.length]);

  const project = projects[currentIndex];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 60 : -60,
      opacity: 0,
    }),
  };

  return (
    <section className="relative border-y border-white/5 bg-surface-container-low/50 py-20 backdrop-blur-sm md:py-24">
      <div className="container-shell">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div className="relative">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs tracking-[0.3em] text-secondary uppercase"
            >
              Featured System
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-5 max-w-xl font-heading text-4xl font-bold text-primary md:text-5xl"
            >
              Building at the edge of performance.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-6 max-w-xl text-lg leading-8 text-on-surface-variant"
            >
              My architecture approach combines dependable backend design,
              maintainable admin surfaces, and clean interaction design.
            </motion.p>

            <div className="mt-8 min-h-[160px] md:min-h-[180px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={project.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.3 },
                  }}
                >
                  <div className="flex flex-wrap gap-3">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/8 bg-surface-container-high px-3 py-1 text-xs tracking-[0.2em] text-secondary uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group mt-8 inline-flex items-center gap-2 font-semibold text-primary-container"
                  >
                    Open featured case study
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>

            {projects.length > 1 && (
              <div className="mt-8 flex max-w-full flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => paginate(-1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-primary transition-colors hover:border-primary-container/30 hover:text-primary-container"
                  aria-label="Previous project"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex gap-2">
                  {projects.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setDirection(index > currentIndex ? 1 : -1);
                        setCurrentIndex(index);
                      }}
                      className={`h-2 rounded-full transition-all ${
                        index === currentIndex
                          ? "w-6 bg-primary-container"
                          : "w-2 bg-white/20 hover:bg-white/40"
                      }`}
                      aria-label={`Go to project ${index + 1}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => paginate(1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-primary transition-colors hover:border-primary-container/30 hover:text-primary-container"
                  aria-label="Next project"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={project.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                }}
              >
                <Link
                  href={`/projects/${project.slug}`}
                  className="group relative block overflow-hidden rounded-[2rem] border border-white/5"
                >
                  <div className="relative aspect-video">
                    <ProjectMedia
                      imageUrl={project.image_url}
                      title={project.title}
                      className="transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-transparent" />
                    <div className="absolute inset-0 bg-primary-container/0 transition-colors duration-500 group-hover:bg-primary-container/5" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                    <p className="text-xs tracking-[0.3em] text-secondary uppercase">
                      {project.category}
                    </p>
                    <h3 className="mt-3 font-heading text-2xl font-bold text-primary md:text-3xl">
                      {project.title}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
