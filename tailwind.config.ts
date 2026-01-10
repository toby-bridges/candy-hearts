import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ritual: {
          warm: '#FDF8F3',      // 背景暖色
          card: '#F5EDE6',      // 卡片背景
          border: '#E8DDD4',    // 边框
          accent: '#D4A574',    // 强调色/按钮
          brown: '#8B7355',     // 重要文字
          text: '#4A4A4A',      // 正文
          muted: '#9CA3AF',     // 次要文字
          // 仪式专属色
          seal: '#B8C5D6',      // 封存 - 雾霾蓝
          erase: '#D4B5A0',     // 抹除 - 沙棕色
          cherish: '#C9B8A8',   // 珍藏 - 奶茶色
        },
      },
      fontFamily: {
        serif: ['Noto Serif SC', 'serif'],
        sans: ['Noto Sans SC', 'sans-serif'],
      },
      borderRadius: {
        'ritual': '1rem',
      },
      boxShadow: {
        'ritual': '0 4px 20px rgba(139, 115, 85, 0.1)',
        'ritual-lg': '0 8px 40px rgba(139, 115, 85, 0.15)',
      },
    },
  },
  plugins: [],
}

export default config
