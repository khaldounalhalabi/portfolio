import type {Context, Next} from "hono";

import {config} from "../config.js";

export async function apiKeyMiddleware(
    c: Context,
    next: Next,
): Promise<Response | void> {
    const providedKey = c.req.header("x-api-key");

    if (!providedKey || providedKey !== config.apiKey) {
        console.log(`NEXT: ${providedKey}`)
        console.log(`HONO: ${config.apiKey}`)
        return c.json({error: "Unauthorized"}, 401);
    }

    await next();
}
