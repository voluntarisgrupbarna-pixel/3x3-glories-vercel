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
  async rewrites() {
    return [
      // Sorteig ruleta — fitxer estàtic a public/ruleta/index.html
      { source: '/ruleta',          destination: '/ruleta/index.html' },
      { source: '/ruleta/',         destination: '/ruleta/index.html' },
      // Dashboard estadístiques
      { source: '/ruleta/stats',    destination: '/ruleta/stats.html' },
      { source: '/ruleta/stats/',   destination: '/ruleta/stats.html' },
      // Rasca i Guanya — fitxer estàtic a public/rasca/index.html
      { source: '/rasca',           destination: '/rasca/index.html' },
      { source: '/rasca/',          destination: '/rasca/index.html' },
    ];
  },
};

export default nextConfig;
