/** @type {import('next').NextConfig} */
const nextConfig = {
<<<<<<< HEAD
    experimental: {
      appDir: true,
    },
    images: {
      domains: ["localhost"],
      remotePatterns: [
        {
          protocol: "https",
          hostname: "*.supabase.co",
          port: "",
          pathname: "/storage/v1/object/public/**",
        },
      ],
      unoptimized: true,
    },
    // Enable source maps in development for better debugging
    productionBrowserSourceMaps: false,
  
    // Optimize for educational/development use
    swcMinify: true,
  
    // Environment variables that should be available to the browser
    env: {
      CUSTOM_KEY: "my-value",
    },
  
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
  }
  
  module.exports = nextConfig
  
=======
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
>>>>>>> 595bee3463104cee9216762a786993bc50791b83
