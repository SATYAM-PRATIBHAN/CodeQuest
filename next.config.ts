import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    env: {
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    },
    pwa: {
      dest: "public",
      register: true,
      skipWaiting: true,
    },
};

export default nextConfig;
