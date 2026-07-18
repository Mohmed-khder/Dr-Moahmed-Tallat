import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.mohamedtalat.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.mohamedtalat.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:locale(ar|en)/articles-columns",
        destination: "/:locale/analyses",
        permanent: true,
      },
      {
        source: "/:locale(ar|en)/articles-columns/:path*",
        destination: "/:locale/analyses",
        permanent: true,
      },
      {
        source: "/:locale(ar|en)/talaat-cv",
        destination: "/:locale",
        permanent: true,
      },
      {
        source: "/:locale(ar|en)/talaat-cv/:path*",
        destination: "/:locale",
        permanent: true,
      },
      {
        source: "/:locale(ar|en)/ai-poilcy",
        destination: "/:locale/ai-policy",
        permanent: true,
      },
      {
        source: "/:locale(ar|en)/ai-poilcy/:path*",
        destination: "/:locale/ai-policy",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:locale(ar|en)/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, must-revalidate",
          },
        ],
      },
      {
        source: "/api/nav-data",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://static.cloudflareinsights.com; script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob: https://www.google-analytics.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https: ws: wss: https://www.google-analytics.com https://region1.google-analytics.com; frame-src 'self' https://www.youtube.com https://youtube.com https://www.instagram.com https://www.facebook.com https://www.tiktok.com https://api.mohamedtalat.org https://api.mohamedtalat.com https://www.google.com https://www.googletagmanager.com;",
          },
          
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
