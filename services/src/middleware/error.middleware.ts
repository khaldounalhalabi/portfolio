import type { Context, ErrorHandler } from "hono";

export const errorMiddleware: ErrorHandler = (err, c: Context) => {
  const message = err instanceof Error ? err.message : "Internal server error";

  console.error("Unhandled error:", err);

  return c.json({ error: message }, 500);
};
