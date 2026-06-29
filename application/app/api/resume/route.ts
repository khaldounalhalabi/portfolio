import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import ResumeService from "@/services/ResumeService";

export async function GET() {
  try {
    const supabase = await createClient();
    const publicUrl = await ResumeService.make().getOrRegenerate(supabase);

    return NextResponse.redirect(publicUrl, { status: 307 });
  } catch (error) {
    console.error("Failed to serve resume:", error);

    return NextResponse.json(
      { error: "Resume could not be generated or retrieved" },
      { status: 500 },
    );
  }
}
