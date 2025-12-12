/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  // Note: 'standalone' output causes symlink issues on Windows
  // Vercel handles optimization automatically, so we don't need it
  reactStrictMode: true,
  swcMinify: true,
  
  webpack: (config, { isServer }) => {
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Stub native-only modules that some deps optionally import
      '@react-native-async-storage/async-storage': false,
      'pino-pretty': false,
    }
    
    // Optimize chunk loading
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
          },
        },
      }
    }
    
    return config
  },
  // Increase timeout for chunk loading
  experimental: {
    webpackBuildWorker: true,
  },
  // CSP headers are handled by middleware.ts
  // Removed duplicate CSP configuration to avoid conflicts
};

export default nextConfig;
