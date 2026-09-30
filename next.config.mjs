import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Required for Capacitor
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@designcodeio/threeui/style.css': path.resolve(process.cwd(), 'src/shaders/threeui.css'),
      '@designcodeio/threeui': path.resolve(process.cwd(), 'src/shaders/index.ts'),
    };
    return config;
  },
};

export default nextConfig;
