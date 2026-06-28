import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const remotePatterns = [];

if (supabaseUrl) {
  const url = new URL(supabaseUrl);

  remotePatterns.push({
    protocol: url.protocol.replace(":", "") as "http" | "https",
    hostname: url.hostname,
    port: url.port || undefined,
    pathname: "/storage/v1/object/public/**",
  });
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
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