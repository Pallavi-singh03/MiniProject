/** @type {import('next').NextConfig} */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,       // optional but recommended
  output: 'standalone',        // ensures Vercel detects your App Router properly
  images: {
    domains: ['firebasestorage.googleapis.com'], // add other domains if you use them
  },
};

export default nextConfig;
