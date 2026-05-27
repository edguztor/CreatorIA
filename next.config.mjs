/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow reading raw body for Stripe webhook signature verification
  experimental: {},
  images: {
    remotePatterns: [],
  },
}

export default nextConfig
