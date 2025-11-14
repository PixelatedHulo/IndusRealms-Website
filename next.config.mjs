/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // avoids build errors from lint warnings
  },
  typescript: {
    ignoreBuildErrors: true, // allows builds even if TS types fail
  },
  images: {
    unoptimized: true, // no Image Optimization (faster local dev + static export)
    domains: [
      "cdn.discordapp.com",   // Discord attachments
      "media.discordapp.net", // Discord embeds/resized images
    ],
  },
};

export default nextConfig;
