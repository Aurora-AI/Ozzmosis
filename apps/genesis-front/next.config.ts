import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Rewrites for local dev to avoid CORS issues with CRM backend
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiUrl}/v1/:path*`,
      },
    ]
  },
}

export default nextConfig
