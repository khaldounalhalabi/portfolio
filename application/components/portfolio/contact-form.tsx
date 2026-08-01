"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(120),
  email: z.email("Please enter a valid email").trim().max(254),
  subject: z.string().trim().max(160).optional(),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least a few words")
    .max(5000),
  // Honeypot — hidden from humans, tempting to bots.
  company: z.string().max(0).optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const fieldClass =
  "w-full border-b border-border bg-transparent py-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", subject: "", message: "", company: "" },
  });

  const onSubmit = async (values: ContactFormValues) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(body.error ?? "Something went wrong");
      }

      toast.success("Message sent — I'll get back to you soon.");
      reset();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Your message could not be sent. Please try again.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8" noValidate>
      {/* Honeypot: visually hidden, off the tab order, never seen by users. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("company")}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            className={fieldClass}
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-2 font-mono text-xs text-destructive">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={fieldClass}
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-2 font-mono text-xs text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <label
          htmlFor="subject"
          className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase"
        >
          Subject{" "}
          <span className="text-muted-foreground/60 normal-case">(optional)</span>
        </label>
        <input
          id="subject"
          type="text"
          placeholder="What's this about?"
          className={fieldClass}
          {...register("subject")}
        />
      </div>

      <div className="mt-6">
        <label
          htmlFor="message"
          className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase"
        >
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="Tell me about your project or idea…"
          className={`${fieldClass} resize-none`}
          aria-invalid={!!errors.message}
          {...register("message")}
        />
        {errors.message && (
          <p className="mt-2 font-mono text-xs text-destructive">
            {errors.message.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="group mt-8 inline-flex items-center gap-3 border border-border px-6 py-3 font-mono text-sm text-foreground transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            Sending
            <Loader2 className="h-4 w-4 animate-spin" />
          </>
        ) : (
          <>
            Send message
            <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </form>
  );
}
