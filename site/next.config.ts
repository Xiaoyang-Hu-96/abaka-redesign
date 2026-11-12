import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // This app lives in site/ inside the design repo; pin the root so Next does not pick up a parent lockfile.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
