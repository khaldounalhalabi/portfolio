"use server";

import { createClient } from "@/lib/supabase/server";
import * as screenshotone from "screenshotone-api-sdk";

const BUCKET_NAME = "portfolio-images";
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
    .format("webp")
    .viewportWidth(1280)
    .viewportHeight(720);

  const imageBlob = await client.take(options);
  if (!imageBlob) {
    console.error("Could not capture project screenshot");
    return { error: "Could not capture project screenshot" };
  }

  const supabase = await createClient();
  const path = `projects/${Date.now()}-${Math.random().toString(36).slice(2)}.png`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, imageBlob, {
      contentType: "image/png",
      upsert: false,
    });

  if (uploadError) {
    console.error(uploadError);
    return { error: uploadError.message };
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);

  return { imageUrl: data.publicUrl };
}
