import { z } from "zod";

const configSchema = z.object({
  port: z.coerce.number().int().positive().default(3001),
  nodeEnv: z.enum(["development", "production", "test"]).default("development"),
  supabaseUrl: z.string().url(),
  supabaseServiceRoleKey: z.string().min(1),
  apiKey: z.string().min(1),
  resumeBucketName: z.string().min(1).default("resume"),
  resumeObjectPath: z.string().min(1).default("khaldoun-alhalabi-resume.pdf"),
  chromeExecutablePath: z.string().optional(),
  smtpHost: z.string().min(1),
  smtpPort: z.coerce.number().int().positive().default(587),
  // z.coerce.boolean() treats any non-empty string as true (even "false"), so
  // parse the common truthy strings explicitly instead.
  smtpSecure: z
    .string()
    .optional()
    .transform((value) => value === "true" || value === "1"),
  smtpUser: z.string().min(1),
  smtpPassword: z.string().min(1),
  // Address the contact emails are sent from (usually the authenticated SMTP user).
  contactFromAddress: z.string().email(),
  // Address that receives the contact form submissions.
  contactToAddress: z.string().email(),
});

export type Config = z.infer<typeof configSchema>;

function loadConfig(): Config {
  const parsed = configSchema.safeParse({
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    apiKey: process.env.API_KEY,
    resumeBucketName: process.env.RESUME_BUCKET_NAME,
    resumeObjectPath: process.env.RESUME_OBJECT_PATH,
    chromeExecutablePath: process.env.CHROME_EXECUTABLE_PATH,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpSecure: process.env.SMTP_SECURE,
    smtpUser: process.env.SMTP_USER,
    smtpPassword: process.env.SMTP_PASSWORD,
    contactFromAddress: process.env.CONTACT_FROM_ADDRESS,
    contactToAddress: process.env.CONTACT_TO_ADDRESS,
  });

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(`Invalid environment configuration:\n${issues}`);
  }

  return parsed.data;
}

export const config = loadConfig();
