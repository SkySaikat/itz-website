import { readFileSync } from 'node:fs';

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
    // WordPress served every post at the site root (/post-slug). The rebuild
    // moved them under /blog. Build the 301 list from the same index the blog
    // routes read so a slug can never exist in one place and not the other.
    // Evaluated once at build time, not per request.
    const posts = JSON.parse(readFileSync('./src/content/posts-index.json', 'utf8'));
    const postRedirects = posts.map((post) => ({
      source: `/${post.slug}`,
      destination: `/blog/${post.slug}`,
      permanent: true,
    }));

    // WordPress archive URLs with no equivalent page in the rebuild. Send them
    // to the blog index rather than letting them 404.
    const archiveRedirects = [
      { source: '/category/:path*', destination: '/blog', permanent: true },
      { source: '/tag/:path*', destination: '/blog', permanent: true },
      { source: '/author/:path*', destination: '/blog', permanent: true },
      { source: '/feed', destination: '/blog', permanent: true },
      { source: '/page/:n', destination: '/blog', permanent: true },
    ];

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
      ...archiveRedirects,
      ...postRedirects,
    ];
  },
};

export default nextConfig;
