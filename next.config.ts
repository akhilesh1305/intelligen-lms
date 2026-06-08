import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["tailwind-merge", "clsx"],
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
};

export default nextConfig;
