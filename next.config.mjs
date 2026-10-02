/** @type {import('next').NextConfig} */
const nextConfig = {
  // Deployed to https://amiryxe.github.io/next-persian-fonts/ (GitHub Pages project site)
  basePath: '/next-persian-fonts',
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true },
}

export default nextConfig
