import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Use this app as the root so Turbopack uses this directory's package-lock.json
    // and doesn't get confused by the lockfile at the workspace root (2034/)
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
