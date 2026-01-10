# Implementation Plan: 分手照片仪式 MVP

**Branch**: `001-breakup-photo-mvp` | **Date**: 2026-01-10 | **Deadline**: 6小时
**Spec**: [spec.md](./spec.md)

---

## Summary

Next.js 单页应用，让用户上传分手照片，选择「封存」「抹除他」「珍藏故事」三种仪式之一，生成处理后的图片并下载。核心价值：给痛苦一个有仪式感的出口。

---

## Future Vision (v2.0+)

> MVP之后的演进路径，影响当前架构决策

- **iOS App**: 使用 React Native 或 Expo 复用 React 组件逻辑
- **后端 API**: Next.js API Routes + Prisma + PostgreSQL
- **动画增强**: Framer Motion → 未来可迁移到 React Native Reanimated
- **用户系统**: NextAuth.js + Prisma User model
- **云存储**: 可选的加密云端封存（时间胶囊功能）

**当前MVP架构决策需考虑**：
- 组件化设计，便于复用到 React Native
- 预留 API route 目录结构（即使暂不使用）
- 使用 Tailwind 的设计 token，便于未来主题切换

---

## Technical Context

### Tech Stack Decisions

| Component | Choice | Why Chosen | Why NOT Alternative | Future Migration |
|-----------|--------|------------|---------------------|------------------|
| 框架 | **Next.js 14 (App Router)** | 用户熟悉，便于扩展 | Vanilla JS - 无法复用到RN | → React Native |
| 图片处理 | **Canvas API** | 浏览器原生，性能好 | 第三方库 - 增加体积 | → expo-image-manipulator |
| 涂抹功能 | **Canvas 2D + React Ref** | 可封装为组件 | Fabric.js - 过重 | → react-native-canvas |
| 样式 | **Tailwind CSS** | 用户熟悉，开发快 | CSS Modules - 更繁琐 | → NativeWind |
| 动画 | **Framer Motion (轻量使用)** | 仪式感过渡效果 | 原生CSS - 不够流畅 | → Reanimated |
| 部署 | **Vercel** | 用户熟悉，一键部署 | 其他 - 无必要 | 保持 |
| HEIC支持 | **heic2any** | 轻量，专门处理HEIC | 服务端 - 违反隐私 | → iOS原生支持 |

### Detailed Context

- **Language**: TypeScript（类型安全，便于后续维护）
- **Primary Dependencies**:
  ```json
  {
    "next": "^14",
    "react": "^18",
    "tailwindcss": "^3",
    "framer-motion": "^10",
    "heic2any": "^0.0.4"
  }
  ```
- **Storage**: MVP无持久化，未来 Prisma + PostgreSQL
- **Testing**: 手动测试为主（6小时内不写自动化测试）
- **Target Platform**: Mobile-first Web（iOS Safari优先）
- **Hosting**: Vercel（免费，自动HTTPS，用户已熟悉）

### Future API Structure (预留，暂不实现)

```
app/
├── api/
│   ├── rituals/        # 未来：保存仪式记录
│   │   └── route.ts
│   └── feedback/       # 未来：用户反馈
│       └── route.ts
```

---

## Constitution Check

### Gate 1: Simplicity (≤3 projects)

- [x] **Pass**: 1个项目（单页静态站）

### Gate 2: Test-First

- [ ] **Skip**: 6小时MVP，手动测试优先

### Gate 3: Framework Trust

- [x] **Pass**: 使用原生API，无框架封装

### Gate 4: Dependency Minimization

- [x] **Pass**: 1个外部依赖（heic2any）

| Principle | Pass/Fail | Measurement | Notes |
|-----------|-----------|-------------|-------|
| Simplicity | ✅ Pass | 1 project | Next.js单页应用 |
| Test-First | ⏭ Skip | MVP阶段 | 手动测试 |
| Framework Trust | ✅ Pass | 0 wrappers | 使用Next.js/React原生能力 |
| Dependencies | ✅ Pass | 5 packages | next, react, tailwind, framer-motion, heic2any |

---

## Project Structure

```
breakup-photo-ritual/
├── app/
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 首页（上传入口）
│   ├── globals.css         # Tailwind 入口
│   └── api/                # 预留API目录（暂空）
├── components/
│   ├── ui/                 # 基础UI组件（可复用到RN）
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   ├── upload/
│   │   └── PhotoUploader.tsx
│   ├── rituals/
│   │   ├── RitualSelector.tsx   # 仪式选择器
│   │   ├── SealRitual.tsx       # 封存
│   │   ├── EraseRitual.tsx      # 抹除（含涂抹画布）
│   │   └── CherishRitual.tsx    # 珍藏
│   └── result/
│       └── RitualResult.tsx     # 结果展示+下载
├── hooks/
│   ├── useImageProcessor.ts     # Canvas 处理逻辑
│   └── useDrawingCanvas.ts      # 涂抹画布逻辑
├── lib/
│   ├── imageUtils.ts            # 图片压缩、格式转换
│   ├── ritualEffects.ts         # 封存/抹除/珍藏效果
│   └── copywriting.ts           # 治愈文案库
├── public/
│   └── textures/                # 封条纹理等
├── specs/                       # 规格文档
├── tailwind.config.ts
├── next.config.js
└── package.json
```

### 组件设计原则（便于未来迁移RN）

- UI组件只用 `className` 不用 DOM 特定 API
- Canvas 逻辑封装在 hooks 中，便于替换实现
- 状态管理用 React 内置（useState/useReducer），不引入外部库

---

## 核心页面流程

```
┌─────────────────────────────────────────────────────────────┐
│                        首页                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │     "你有一张不知道该怎么处理的照片吗？"              │   │
│  │                                                       │   │
│  │         [ 📷 点击上传照片 ]                          │   │
│  │                                                       │   │
│  │     "你的照片不会离开你的设备"                        │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     选择仪式页                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              [ 照片预览 ]                            │   │
│  │                                                       │   │
│  │  (可选) 你现在的感觉是？                              │   │
│  │  [ 愤怒 ] [ 悲伤 ] [ 释然 ] [ 复杂 ] [ 跳过 ]        │   │
│  │                                                       │   │
│  │  选择你想做的事：                                     │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐            │   │
│  │  │   封存   │ │  抹除他  │ │ 珍藏故事 │            │   │
│  │  │ 暂时不看 │ │ 留下自己 │ │ 记住美好 │            │   │
│  │  └──────────┘ └──────────┘ └──────────┘            │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐
│      封存流程      │ │     抹除流程      │ │     珍藏流程      │
│                   │ │                   │ │                   │
│ → 自动处理        │ │ → 涂抹界面        │ │ → 输入文字        │
│ → 显示效果        │ │ → 用户涂抹        │ │ → 选择位置        │
│ → 下载            │ │ → 确认效果        │ │ → 确认效果        │
│                   │ │ → 下载            │ │ → 下载            │
└───────────────────┘ └───────────────────┘ └───────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      完成页                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              [ 处理后的图片 ]                        │   │
│  │                                                       │   │
│  │        "这是一个勇敢的决定。"                         │   │
│  │        （治愈文案，根据选择变化）                     │   │
│  │                                                       │   │
│  │     [ 下载图片 ]    [ 处理另一张 ]                   │   │
│  │                                                       │   │
│  │     ────────────────────────────                     │   │
│  │     想说点什么？[        ] [提交反馈]                │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 视觉效果技术方案

### 封存效果
```javascript
// Canvas处理流程
1. 绘制原图
2. 应用高斯模糊 (ctx.filter = 'blur(20px)')
3. 叠加半透明封条纹理图
4. 添加日期文字 "封存于 2026.01.10"
5. 导出为图片
```

### 抹除效果
```javascript
// 涂抹画布流程
1. 显示原图作为背景
2. 创建透明遮罩层
3. 用户触摸/鼠标绘制
4. 绘制区域应用马赛克/模糊效果
5. 合成导出
```

### 珍藏效果
```javascript
// 卡片生成流程
1. 绘制原图
2. 应用柔和滤镜 (降低饱和度+轻微暖色)
3. 底部添加半透明文字背景
4. 渲染用户输入的文字
5. 导出为图片
```

---

## 治愈文案库

### 封存
- "有些东西，现在不看不代表忘记。"
- "封存不是逃避，是给自己时间。"
- "等你准备好了，它还会在这里。"

### 抹除
- "留下的是回忆，抹去的是他的位置。"
- "你有权决定谁出现在你的故事里。"
- "这张照片里，最重要的人是你。"

### 珍藏
- "感谢这段经历，让你成为了现在的你。"
- "不是所有结束都是遗憾。"
- "谢谢你来过。"

---

## 时间分配（6小时）

| 阶段 | 时间 | 产出 |
|------|------|------|
| 搭建基础结构 | 0.5h | HTML骨架 + CSS基础 + 文件结构 |
| 上传功能 | 0.5h | 图片上传 + 预览 + HEIC转换 |
| 封存功能 | 1h | 模糊 + 封条效果 + 下载 |
| 抹除功能 | 1.5h | 涂抹画布 + 遮罩效果 + 下载 |
| 珍藏功能 | 1h | 文字输入 + 卡片渲染 + 下载 |
| UI打磨 + 文案 | 1h | 移动端适配 + 文案 + 视觉细节 |
| 部署 + 测试 | 0.5h | Vercel部署 + 手机实测 |

**Buffer**: 无。6小时是硬限制，如有延迟优先砍「珍藏」功能。

---

## 风险与应对

| 风险 | 可能性 | 影响 | 应对方案 |
|------|--------|------|----------|
| 涂抹功能touch事件调试复杂 | 高 | 高 | 预留额外30分钟，或降级为简单矩形选区 |
| HEIC转换库加载慢 | 中 | 中 | 异步加载，只在需要时引入 |
| 大图处理卡顿 | 中 | 中 | 上传时自动压缩到2000px宽 |
| 移动端Safari兼容问题 | 中 | 高 | 用真机测试Safari，预留调试时间 |

---

## Complexity Tracking

无Constitution Check违规，此部分为空。
