import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/sb/:path*",
        destination: "https://ymaxufmegvgswibdjklp.supabase.co/:path*",
      },
    ];
  },
};

export default nextConfig;
