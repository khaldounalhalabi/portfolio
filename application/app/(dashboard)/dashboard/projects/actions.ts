"use server";

import { createClient } from "@/lib/supabase/server";
import * as screenshotone from "screenshotone-api-sdk";

const BUCKET_NAME = "portfolio-images";
const IMAGE_FORMAT = "webp";
const accessKey = process.env.SCREENSHOTONE_ACCESS_KEY;
const secretKey = process.env.SCREENSHOTONE_SECRET_KEY;

const client = new screenshotone.Client(accessKey ?? "", secretKey ?? "");

export async function fetchProjectImageAction(projectUrl: string) {
  if (!projectUrl.trim()) {
    return { error: "Project URL is required" };
  }

  try {
    new URL(projectUrl);
  } catch {
    return { error: "Invalid project URL" };
  }

  const options = screenshotone.TakeOptions.url(projectUrl)
    .ignoreHostErrors(true)
    .delay(3)
    .blockAds(true)
    .format(IMAGE_FORMAT)
    .viewportWidth(1280)
    .viewportHeight(720);

  const imageBlob = await client.take(options);
  if (!imageBlob) {
    console.error("Could not capture project screenshot");
    return { error: "Could not capture project screenshot" };
  }

  // Materialize the blob into a buffer before uploading. In serverless
  // environments (e.g. Vercel) passing the cross-fetch Blob directly to
  // Supabase storage can cause the uploaded file to be truncated or
  // interpreted incorrectly.
  const imageBuffer = Buffer.from(await imageBlob.arrayBuffer());
  const contentType = imageBlob.type || `image/${IMAGE_FORMAT}`;

  console.log(
    "Captured project screenshot:",
    { projectUrl, size: imageBuffer.length, contentType },
  );

  const supabase = await createClient();
  const path = `projects/${Date.now()}-${Math.random().toString(36).slice(2)}.${IMAGE_FORMAT}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, imageBuffer, {
      contentType,
      upsert: false,
    });

  if (uploadError) {
    console.error(uploadError);
    return { error: uploadError.message };
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);

  return { imageUrl: data.publicUrl };
}
