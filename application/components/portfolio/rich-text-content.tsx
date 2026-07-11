import { cn } from "@/lib/utils";
import { sanitizeRichText } from "@/lib/rich-text";

export function RichTextContent({
  value,
  className,
}: {
  value: string | null | undefined;
  className?: string;
}) {
  const html = sanitizeRichText(value);

  return (
    <div
      className={cn(
        "prose prose-invert max-w-none prose-p:text-muted-foreground prose-p:leading-8 prose-headings:font-heading prose-headings:font-semibold prose-headings:text-foreground prose-strong:text-foreground prose-strong:font-semibold prose-li:text-muted-foreground prose-a:text-foreground prose-a:underline prose-a:decoration-border prose-a:underline-offset-4 hover:prose-a:decoration-foreground prose-blockquote:border-l-foreground/30 prose-blockquote:text-muted-foreground prose-blockquote:not-italic prose-code:font-mono prose-code:text-foreground",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
