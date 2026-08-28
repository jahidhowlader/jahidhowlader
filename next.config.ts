import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the repository free of generated agent instruction files.
  agentRules: false,
};

export default nextConfig;
