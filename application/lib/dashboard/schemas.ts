import { z } from "zod";

export const supportedProjectImageTypes = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
] as const;

export const projectImageAccept =
  ".png,.jpg,.jpeg,.webp,.gif,.avif,.svg,image/png,image/jpeg,image/webp,image/gif,image/avif,image/svg+xml";

const fileListSchema = z.custom<FileList | undefined>(
  (value) => typeof FileList !== "undefined" && value instanceof FileList,
  "Invalid file input",
);

export function getProjectSchema(requireImage: boolean) {
  return z
    .object({
      id: z.string().optional(),
      title: z.string().trim().min(1, "Title is required"),
      slug: z.string().trim().optional(),
      category: z.string().trim().min(1, "Category is required"),
      description: z.string().trim().min(1, "Description is required"),
      longDescription: z.string().trim().optional(),
      role: z.string().trim().optional(),
      year: z.string().trim().optional(),
      problem: z.string().trim().optional(),
      solution: z.string().trim().optional(),
      tags: z.string().trim().optional(),
      features: z.string().trim().optional(),
      techStack: z.string().trim().optional(),
      displayOrder: z.coerce.number().int().min(0),
      featured: z.boolean().optional().default(false),
      existingImagePath: z.string().trim().optional(),
      removeImage: z.boolean().optional().default(false),
      imageFile: fileListSchema.optional(),
    })
    .superRefine((value, ctx) => {
      const hasFile = Boolean(value.imageFile && value.imageFile.length > 0);
      const hasExistingImage = Boolean(value.existingImagePath);
      const removingImage = Boolean(value.removeImage);

      if (requireImage && !hasFile && !hasExistingImage && !removingImage) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["imageFile"],
          message: "Project image is required.",
        });
      }

      if (hasFile) {
        const file = value.imageFile?.item(0);

        if (file && !file.type.startsWith("image/")) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["imageFile"],
            message: "Upload an image file.",
          });
        }

        if (file && !supportedProjectImageTypes.includes(file.type as (typeof supportedProjectImageTypes)[number])) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["imageFile"],
            message: "Use PNG, JPEG, WebP, GIF, AVIF, or SVG.",
          });
        }
      }
    });
}

export type ProjectFormValues = z.input<ReturnType<typeof getProjectSchema>>;

export const skillGroupSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(1, "Title is required"),
  icon: z.string().trim().min(1, "Icon is required"),
  skills: z.string().trim().min(1, "Add at least one skill"),
  description: z.string().trim().optional(),
  displayOrder: z.coerce.number().int().min(0),
  isHighlight: z.boolean().optional().default(false),
});

export type SkillGroupFormValues = z.input<typeof skillGroupSchema>;

export const contactInfoSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().min(1, "Phone is required"),
  location: z.string().trim().min(1, "Location is required"),
  intro: z.string().trim().min(1, "Intro copy is required"),
  availability: z.string().trim().min(1, "Availability is required"),
  resumeLabel: z.string().trim().optional(),
  resumeUrl: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || z.url().safeParse(value).success, {
      message: "Enter a valid resume URL",
    }),
});

export type ContactInfoFormValues = z.input<typeof contactInfoSchema>;

export const contactLinkSchema = z.object({
  id: z.string().optional(),
  label: z.string().trim().min(1, "Label is required"),
  url: z
    .string()
    .trim()
    .min(1, "URL is required")
    .refine((value) => z.url().safeParse(value).success, {
      message: "Enter a valid URL",
    }),
  icon: z.string().trim().min(1, "Icon is required"),
  displayOrder: z.coerce.number().int().min(0),
});

export type ContactLinkFormValues = z.input<typeof contactLinkSchema>;
