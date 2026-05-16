/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'cbgrupbarna-3x3timechamber.com' }],
        destination: 'https://www.cbgrupbarna-3x3timechamber.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
