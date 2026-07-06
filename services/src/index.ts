import { serve } from "@hono/node-server";
import 'dotenv/config'

import { config } from "./config.js";
import { createApp } from "./app.js";

const app = createApp();

const server = serve(
  {
    fetch: app.fetch,
    port: config.port,
  },
  (info) => {
    console.log(
      `Portfolio services running on port ${info.port} in ${config.nodeEnv} mode`,
    );
  },
);

function shutdown(signal: string) {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
