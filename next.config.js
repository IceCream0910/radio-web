/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa");

const nextConfig = withPWA({
  dest: "public",
  runtimeCaching: []
})();

module.exports = nextConfig
