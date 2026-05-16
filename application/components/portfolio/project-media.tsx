import Image from "next/image";

export function ProjectMedia({
  imageUrl,
  title,
  priority = false,
}: {
  imageUrl?: string | null;
  title: string;
  priority?: boolean;
}) {
  if (!imageUrl) {
    return (
      <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-surface-container-high to-surface-container-low">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,245,255,0.16),transparent_0_35%),radial-gradient(circle_at_80%_10%,rgba(125,255,162,0.12),transparent_0_30%)]" />
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <p className="font-heading text-4xl font-bold tracking-[0.3em] text-primary/35 md:text-5xl">
              {title.slice(0, 3).toUpperCase()}
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.25em] text-on-surface-variant">
              Upload project image in dashboard
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
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={title}
      fill
      priority={priority}
      className="object-cover"
    />
  );
}
