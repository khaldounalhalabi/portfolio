import type { Context } from "hono";

import { MailService } from "../services/mail.service.js";

export async function sendContactMessage(c: Context) {
  try {
    // Use the body validated by the route's zValidator so the zod .trim()
    // transforms are applied (c.req.json() would return the raw, untrimmed body).
    const payload = c.req.valid("json" as never) as {
      name: string;
      email: string;
      subject?: string;
      message: string;
    };

    await MailService.make().sendContactMessage(payload);

    return c.json({ success: true }, 200);
  } catch (error) {
    console.error("Failed to send contact message:", error);

    const message =
      error instanceof Error ? error.message : "Failed to send message";

    return c.json({ error: message }, 500);
  }
}
