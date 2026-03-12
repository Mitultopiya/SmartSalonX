/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  },
  webpack: (config, { isServer }) => {
    // Fix for axios and face-api.js Node.js modules in browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        buffer: require.resolve('buffer'),
        util: false,
        url: false,
        querystring: false,
        https: false,
        http: false,
        zlib: false,
        encoding: false,
        process: require.resolve('process/browser'),
      };

      // Add polyfills and plugins
      config.resolve.alias = {
        ...config.resolve.alias,
        encoding: 'text-encoding',
      };

      // Add ProvidePlugin for buffer and process
      const webpack = require('webpack');
      config.plugins = config.plugins || [];
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        })
      );
    }

    // Ignore face-api.js Node.js specific modules
    config.externals = config.externals || [];
    config.externals.push({
      'fs': 'commonjs fs',
      'path': 'commonjs path',
      'os': 'commonjs os',
      'crypto': 'commonjs crypto',
      'stream': 'commonjs stream',
      'util': 'commonjs util',
      'url': 'commonjs url',
      'querystring': 'commonjs querystring',
      'https': 'commonjs https',
      'http': 'commonjs http',
      'zlib': 'commonjs zlib',
      'encoding': 'commonjs encoding',
    });

    return config;
  },
};

module.exports = nextConfig;
