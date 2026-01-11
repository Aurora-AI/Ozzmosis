/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    // Canonical local dev target (uvicorn)
    const target = process.env.AURORA_ALVARO_CORE_INTERNAL_URL || "http://127.0.0.1:8010";

    return [
      {
        source: "/genesis/:path*",
        destination: `${target}/genesis/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
