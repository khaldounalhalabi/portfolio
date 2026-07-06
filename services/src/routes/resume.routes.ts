import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

import { generateResume } from "../controllers/resume.controller.js";
import { apiKeyMiddleware } from "../middleware/apiKey.middleware.js";

const resumeRoutes = new Hono();

resumeRoutes.use("/*", apiKeyMiddleware);

resumeRoutes.post(
  "/generate",
  zValidator(
    "json",
    z.object({
      force: z.boolean().optional(),
    }).strict(),
  ),
  generateResume,
);

export default resumeRoutes;
