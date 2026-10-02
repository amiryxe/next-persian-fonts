/** @type {import('next').NextConfig} */
const nextConfig = {
  // Deployed to https://amiryxe.github.io/next-persian-fonts/ (GitHub Pages project site)
  basePath: '/next-persian-fonts',
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true },
  // Don't let `next dev` generate AGENTS.md / CLAUDE.md in the repo root (Next.js 16+)
  agentRules: false,
}

export default nextConfig
