import type { Context, Next } from "hono";

export async function loggerMiddleware(c: Context, next: Next) {
  const start = Date.now();
  const method = c.req.method;
  const path = c.req.path;

  await next();

  const duration = Date.now() - start;
  const status = c.res.status;

  const message = `${method} ${path} - ${status} (${duration}ms)`;

  if (status >= 500) {
    console.error(message);
  } else if (status >= 400) {
    console.warn(message);
  } else {
    console.log(message);
  }
}
