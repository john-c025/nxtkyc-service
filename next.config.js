/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com', 'files.logomakr.com', 'eagleeyecollection.com'],
  },
  compiler: {
    styledComponents: true, // ✅ Enable styled-components with SWC
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Link',
            value: '</globals.css>; rel=preload; as=style',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
