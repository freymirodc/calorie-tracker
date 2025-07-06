/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Netlify
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Add trailing slash for better static hosting compatibility
  trailingSlash: true,
  
  // Disable server-side features for static export
  experimental: {
    // Disable app directory features that require server
    appDir: true,
  },
  
  // Environment variables for build time
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  
  // Configure for static hosting
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  
  // Optimize for static export
  poweredByHeader: false,
  
  // Configure redirects for SPA behavior
  async rewrites() {
    return {
      fallback: [
        {
          source: '/:path*',
          destination: '/404',
        },
      ],
    }
  },
}

module.exports = nextConfig
