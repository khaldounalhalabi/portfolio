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
