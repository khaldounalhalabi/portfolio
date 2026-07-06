"use server";

export async function regenerateResumeAction() {
  try {
    const baseUrl = process.env.RESUME_SERVICE_URL;
    const apiKey = process.env.RESUME_SERVICE_API_KEY;

    if (!baseUrl || !apiKey) {
      throw new Error("Resume service is not configured");
    }

    const response = await fetch(`${baseUrl}/api/v1/resume/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({ force: true }),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      throw new Error(body.error ?? `Resume service returned ${response.status}`);
    }

    const { publicUrl } = (await response.json()) as { publicUrl: string };

    return { publicUrl };
  } catch (error) {
    console.error("Failed to regenerate resume:", error);

    return {
      error:
        error instanceof Error
          ? error.message
          : "Resume regeneration failed",
    };
  }
}
