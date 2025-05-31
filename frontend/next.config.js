/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  webpack: (config) => {
    // See https://webpack.js.org/configuration/resolve/#resolvealias
    config.resolve.alias = {
      ...config.resolve.alias,
      sharp$: false,
      "onnxruntime-node$": false,
      mongodb$: false,
    };
    return config;
  },
  serverExternalPackages: ["llamaindex"], // Move here
  outputFileTracingIncludes: {
    "/*": ["./cache/**/*"],
  }, // Move here
};


module.exports = nextConfig;