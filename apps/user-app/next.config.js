/** @type {import('next').NextConfig} */
module.exports = {
  // transpilePackages: ["@repo/ui"],
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    BACKEND_URL: process.env.BACKEND_URL,
  },
};