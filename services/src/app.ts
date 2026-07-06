import { Hono } from "hono";

import { errorMiddleware } from "./middleware/error.middleware.js";
import { loggerMiddleware } from "./middleware/logger.middleware.js";
import apiRoutes from "./routes/index.js";

export function createApp(): Hono {
  const app = new Hono();

  app.use(loggerMiddleware);

  app.route("/", apiRoutes);

  app.notFound((c) => c.json({ error: "Not found" }, 404));
  app.onError(errorMiddleware);

  return app;
}
