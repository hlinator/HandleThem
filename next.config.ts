import type { NextConfig } from "next";

// Zatím čistě frontend s demo daty -> statický export.
// Až přibude Stripe webhook (route handler), `output: "export"` musí pryč.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
