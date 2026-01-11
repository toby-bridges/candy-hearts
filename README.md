# 告别仪式 | Candy Hearts 💔✨

一个帮助年轻女性以温柔方式处理前任照片的仪式感应用。

> 灵感来源：《老友记》S1E14 "The One with the Candy Hearts"——Phoebe 用火焚烧前男友物品的净化仪式。

## 🎯 核心理念

面对分手后的照片，人们往往陷入两难：删除太决绝，保留又心痛。

我们提供三种有尊严的告别方式：

| 仪式 | 手势 | 含义 |
|------|------|------|
| **封存** | ⬆️ 上滑 | 模糊封印，设定未来开启日期 |
| **抹除** | ⬅️ 左滑 | 让 TA 化作粒子，随风而去 |
| **珍藏** | ➡️ 右滑 | 柔光滤镜，写下想说的话 |

## 🌸 三个版本

我们探索了不同的"抹除"视觉效果：

### 主版本 (master)
- 点击产生马赛克模糊效果
- 最克制、最安静的告别

### 蒲公英版本 (feature/dandelion-effect)
- 点击产生向上飘散的蒲公英粒子
- 温柔、治愈、诗意的告别

### 复仇者联盟版本 (feature/avengers-snap-effect)
- 点击产生灰飞烟灭的粒子解体
- 戏剧性、宣泄、释放的告别

## 🔗 在线体验

- **主版本**: https://candy-hearts.vercel.app
- **蒲公英版**: https://candy-hearts-git-feature-dandelion-effect-toby-bridges.vercel.app
- **复仇者版**: https://candy-hearts-git-feature-avengers-snap-effect-toby-bridges.vercel.app

## 🛠 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **图像处理**: Canvas API
- **iPhone支持**: heic2any (HEIC 转换)

## 🚀 本地运行

```bash
# 克隆仓库
git clone https://github.com/toby-bridges/candy-hearts.git
cd candy-hearts

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 🎨 设计美学

为小红书用户群体打造的视觉风格：

- **克制的温柔** - 不是粉红泡泡，是成熟的柔软
- **留白呼吸感** - 给情绪留出空间
- **质感优先** - 温暖的中性色调

```
主背景: #FDF8F3 (温暖米白)
封存色: #B8C5D6 (雾霾蓝)
抹除色: #D4B5A0 (裸粉)
珍藏色: #C9B8A8 (奶茶色)
```

## 📱 未来规划

- [ ] iOS 原生应用 (React Native/Expo)
- [ ] 更多仪式类型
- [ ] 社区分享功能
- [ ] AI 情感陪伴

## 📄 License

MIT

---

*"有些人值得被温柔地告别。"*
