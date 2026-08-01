import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

import { sendContactMessage } from "../controllers/contact.controller.js";
import { apiKeyMiddleware } from "../middleware/apiKey.middleware.js";

const contactRoutes = new Hono();

// Fields that end up in email headers (name, email, subject) must never contain
// CR/LF — that is the vector for SMTP header injection (adding Bcc:, extra
// Subject:, etc.). We reject rather than strip so malicious input is refused
// outright, not silently mangled.
const noNewlines = /^[^\r\n]*$/;

contactRoutes.use("/*", apiKeyMiddleware);

contactRoutes.post(
  "/send",
  zValidator(
    "json",
    z
      .object({
        name: z
          .string()
          .trim()
          .min(1, "Name is required")
          .max(120)
          .regex(noNewlines, "Name contains invalid characters"),
        email: z
          .email("A valid email is required")
          .trim()
          .max(254)
          .regex(noNewlines, "Email contains invalid characters"),
        subject: z
          .string()
          .trim()
          .max(160)
          .regex(noNewlines, "Subject contains invalid characters")
          .optional(),
        message: z.string().trim().min(1, "Message is required").max(5000),
      })
      .strict(),
  ),
  sendContactMessage,
);

export default contactRoutes;
