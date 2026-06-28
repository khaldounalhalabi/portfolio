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
        "prose prose-invert max-w-none prose-p:text-on-surface-variant prose-p:leading-8 prose-headings:font-heading prose-headings:text-primary prose-strong:text-primary prose-a:text-primary-container prose-li:text-on-surface-variant prose-blockquote:border-primary-container/30 prose-blockquote:text-on-surface-variant",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
