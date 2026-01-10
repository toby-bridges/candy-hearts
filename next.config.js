/** @type {import('next').NextConfig} */
const nextConfig = {
  // 输出静态文件，便于部署
  output: 'export',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
