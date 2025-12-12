/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations (only for production builds)
  // Don't use 'standalone' in development - it can cause issues with ngrok
  ...(process.env.NODE_ENV === 'production' && { output: 'standalone' }),
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
  // Add headers for CSP and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.walletconnect.com https://*.walletconnect.org https://explorer-api.walletconnect.com https://*.reown.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "img-src 'self' data: blob: https: w3.org/svg/2000",
              "connect-src 'self' https://*.walletconnect.com https://*.walletconnect.org https://explorer-api.walletconnect.com https://*.reown.com https://*.rpc.privy.systems https://*.farcaster.xyz https://*.warpcast.com https://*.wrpcd.net wss://*.walletconnect.com wss://*.walletconnect.org",
              "frame-src 'self' https://*.walletconnect.com https://*.walletconnect.org https://*.reown.com",
              "worker-src 'self' blob:",
              "manifest-src 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },
};

export default nextConfig;
