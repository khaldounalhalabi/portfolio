import type { Context } from "hono";

import { ResumeService } from "../services/resume.service.js";

export async function generateResume(c: Context) {
  try {
    const body = await c.req.json<{ force?: boolean }>();
    const publicUrl = await ResumeService.make().getOrRegenerate({
      force: body.force,
    });

    return c.json({ publicUrl }, 200);
  } catch (error) {
    console.error("Failed to generate resume:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Resume generation failed";

    return c.json({ error: message }, 500);
  }
}
