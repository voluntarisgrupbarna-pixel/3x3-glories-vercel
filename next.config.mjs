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
      // Completar dades — formulari per a equips inscrits
      { source: '/completar',       destination: '/completar.html' },
      { source: '/completar/',      destination: '/completar.html' },
      // Dashboard admin
      { source: '/dashboard',       destination: '/dashboard.html' },
      { source: '/dashboard/',      destination: '/dashboard.html' },
      // Check-in app per a voluntaris
      { source: '/checkin',         destination: '/checkin.html' },
      { source: '/checkin/',        destination: '/checkin.html' },
    ];
  },
};

export default nextConfig;
