/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Required for Capacitor
  images: { unoptimized: true }, // Static export doesn't support Next.js Image Optimization
};

export default nextConfig;
