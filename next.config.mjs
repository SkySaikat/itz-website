/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Original WordPress URLs that changed in the rebuild. Everything else keeps
  // its legacy path so existing rankings and backlinks survive the migration.
  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
      { source: '/about', destination: '/about-us', permanent: true },
      { source: '/testimonials', destination: '/about-us', permanent: true },
      // Flat duplicates WordPress accumulated alongside the nested originals.
      { source: '/dentists', destination: '/medical/dentists', permanent: true },
      { source: '/chiropractor', destination: '/medical/chiropractors', permanent: true },
      { source: '/med-spa', destination: '/medical/med-spa', permanent: true },
      { source: '/urgent-care', destination: '/medical/urgent-care', permanent: true },
      { source: '/massage-therapy', destination: '/medical/massage-therapy', permanent: true },
      { source: '/personal-injury-law', destination: '/lawyers/personal-injury', permanent: true },
      { source: '/estate-planning', destination: '/lawyers/estate-planning', permanent: true },
      { source: '/real-estate-agent', destination: '/real-estate/realtor', permanent: true },
      { source: '/auto-repair', destination: '/automotive/auto-repair', permanent: true },
      { source: '/auto-detailing', destination: '/automotive/auto-detailing', permanent: true },
    ];
  },
};

export default nextConfig;
