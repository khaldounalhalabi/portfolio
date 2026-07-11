import { cn } from "@/lib/utils";
import Image from "next/image";
import { HTMLProps } from "react";

export function ProjectMedia({
  imageUrl,
  title,
  priority = false,
  className,
}: {
  imageUrl?: string | null;
  title: string;
  priority?: boolean;
  className?: HTMLProps<HTMLImageElement>["className"];
}) {
  if (!imageUrl) {
    return (
      <div className="relative h-full w-full overflow-hidden bg-surface-container-low">
        <div className="absolute inset-0 grid-lines opacity-50" />
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <p className="font-heading text-5xl font-bold tracking-[0.2em] text-foreground/15 md:text-6xl">
              {title.slice(0, 3).toUpperCase()}
            </p>
            <p className="mt-3 font-mono text-xs tracking-wide text-muted-foreground">
              No image yet
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isSvg = imageUrl.toLowerCase().includes(".svg");

  if (isSvg) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={title}
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={title}
      fill
      priority={priority}
      className={cn("object-cover", className)}
      unoptimized={process.env.NODE_ENV == "development"}
    />
  );
}
