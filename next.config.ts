import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "csfd.cz",
      },
      {
        protocol: "https",
        hostname: "image.pmgstatic.com",
      },
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      }
    ]
  }
}

export default nextConfig
