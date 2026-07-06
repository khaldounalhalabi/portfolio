import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { prerenderToNodeStream } from "react-dom/static";

import { config } from "../../config.js";

import { Resume } from "./Resume.js";
import { getResumeData } from "./getResumeData.js";
import type { SupabaseService } from "../../services/supabase.service.js";

function streamToString(stream: NodeJS.ReadableStream): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
}

function buildResumeHtml(bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Khaldoun Alhalabi - Resume</title>
    <style>
      @page {
        size: A4;
        margin: 0;
      }
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        padding: 0;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    </style>
  </head>
  <body>
    ${bodyHtml}
  </body>
</html>`;
}

export async function generateResume(
  supabaseService: SupabaseService,
): Promise<Buffer> {
  const data = await getResumeData(supabaseService.client);
  const { prelude } = await prerenderToNodeStream(<Resume data={data} />);
  const bodyHtml = await streamToString(prelude);
  const html = buildResumeHtml(bodyHtml);

  const executablePath =
    config.nodeEnv === "development" && config.chromeExecutablePath
      ? config.chromeExecutablePath
      : await chromium.executablePath();

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath,
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
