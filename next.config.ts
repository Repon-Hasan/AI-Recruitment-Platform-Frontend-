import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
        port: "",
        pathname: "/dJxBbFks/brandasset.png",
        search: "",
      },
    ],
  },
};

export default nextConfig;
