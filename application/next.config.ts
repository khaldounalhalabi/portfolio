import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHostname = supabaseUrl
  ? new URL(supabaseUrl).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: "https",
            hostname: supabaseHostname,
          },
        ]
      : [],
  },
  turbopack:
    process.env.NODE_ENV === "development"
      ? {
          resolveAlias: {
            "lucide-react/dynamic": "./lib/lucide-dynamic-stub.tsx",
          },
        }
      : undefined,
};

export default nextConfig;
