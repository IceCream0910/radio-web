/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa");

const nextConfig = withPWA({
  dest: "public",
  runtimeCaching: [],
  turbopack: {}
})();

module.exports = nextConfig
