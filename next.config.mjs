/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
    eslint: {
        ignoreDuringBuilds: true,
      },
      images: {
        domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com', 'mwonya-kasfa-assets-store.s3.us-east-1.amazonaws.com', 'assets.mwonya.com'],
    },
};

export default nextConfig;
