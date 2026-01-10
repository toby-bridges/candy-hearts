# Tasks: 分手照片仪式 MVP

**Prerequisites**: spec.md, plan.md
**Deadline**: 6小时
**Tech Stack**: Next.js 14 + Tailwind CSS + Framer Motion
**Execution Rule**: 按顺序执行，完成一个再下一个

---

## 时间轴总览

```
[0h]──[0.5h]──[1h]──[1.5h]──[2.5h]──[4h]──[5h]──[5.5h]──[6h]
 │      │      │      │       │      │     │      │      │
 └项目初始化─┘ └上传组件┘ └──封存功能──┘ └──抹除功能──┘ └珍藏┘ └打磨┘ └部署┘
```

---

## Phase 1: 项目初始化 (0-0.5h)

**Purpose**: Next.js 项目骨架搭建

- [ ] **T001** 创建 Next.js 项目
  ```bash
  npx create-next-app@latest breakup-photo-ritual --typescript --tailwind --app --src-dir=false
  ```
  - **DoD**: 项目创建成功，`npm run dev` 能运行
  - **Time**: 5min

- [ ] **T002** 安装额外依赖
  ```bash
  npm install framer-motion heic2any
  npm install -D @types/heic2any
  ```
  - **DoD**: 依赖安装成功，无报错
  - **Time**: 3min

- [ ] **T003** 创建目录结构
  ```
  components/ui/
  components/upload/
  components/rituals/
  components/result/
  hooks/
  lib/
  public/textures/
  ```
  - **DoD**: 所有目录创建完成
  - **Time**: 2min

- [ ] **T004** 配置 Tailwind 主题色
  ```typescript
  // tailwind.config.ts - 添加自定义颜色
  colors: {
    ritual: {
      warm: '#FDF8F3',      // 背景暖色
      text: '#4A4A4A',      // 正文色
      accent: '#D4A574',    // 强调色
      muted: '#9CA3AF',     // 次要文字
    }
  }
  ```
  - **DoD**: 自定义颜色可用
  - **Time**: 5min

- [ ] **T005** 编写基础布局 `app/layout.tsx`
  - **DoD**: 移动端viewport设置、全局字体、背景色
  - **Time**: 10min

- [ ] **T006** 编写首页骨架 `app/page.tsx`
  - **DoD**: 显示占位文字，布局正常
  - **Time**: 5min

**Phase Acceptance**: `npm run dev` 运行正常，页面显示

---

## Phase 2: 图片上传组件 (0.5h-1h)

**Purpose**: 核心交互入口

- [ ] **T007** 创建 `lib/imageUtils.ts`
  - 图片压缩函数（限制最大宽度2000px）
  - HEIC转换函数（使用heic2any）
  - **DoD**: 函数导出可用
  - **Time**: 15min

- [ ] **T008** 创建 `components/upload/PhotoUploader.tsx`
  - 点击/拖拽上传区域
  - 隐私提示文案
  - 调用 imageUtils 处理图片
  - **DoD**: 能上传图片并显示预览
  - **Time**: 15min

- [ ] **T009** 集成到首页
  - 上传后显示预览
  - 预览下方显示仪式选择入口
  - **DoD**: 完整上传流程可走通
  - **Time**: 10min

**Phase Acceptance**: 能上传任意照片（包括iPhone HEIC）并预览

---

## Phase 3: 封存功能 (1h-2h)

**Purpose**: 第一个完整仪式

- [ ] **T010** 创建 `lib/ritualEffects.ts` - 封存效果
  ```typescript
  export function applySealEffect(
    canvas: HTMLCanvasElement,
    image: HTMLImageElement
  ): void
  ```
  - 高斯模糊
  - 日期戳文字
  - **DoD**: Canvas处理函数可用
  - **Time**: 20min

- [ ] **T011** 创建封条纹理 `public/textures/seal-overlay.png`
  - 半透明封条效果（可用CSS渐变临时替代）
  - **DoD**: 纹理文件存在或CSS替代方案就绪
  - **Time**: 10min

- [ ] **T012** 创建 `components/rituals/SealRitual.tsx`
  - 接收图片，执行封存效果
  - 显示处理中状态（Framer Motion）
  - 显示结果
  - **DoD**: 点击封存→显示处理后图片
  - **Time**: 20min

- [ ] **T013** 创建 `components/result/RitualResult.tsx`
  - 显示处理后图片
  - 治愈文案
  - 下载按钮
  - **DoD**: 图片可下载到本地
  - **Time**: 15min

- [ ] **T014** 创建 `lib/copywriting.ts` - 文案库
  - 封存文案数组
  - 随机选择函数
  - **DoD**: 能获取随机文案
  - **Time**: 5min

**Phase Acceptance**: 能完成封存全流程并下载处理后的图片

---

## Phase 4: 抹除功能 (2h-3.5h)

**Purpose**: 核心差异化功能

- [ ] **T015** 创建 `hooks/useDrawingCanvas.ts`
  - Canvas 绑定（ref）
  - 触摸/鼠标事件处理
  - 绘制轨迹
  - 清除功能
  - **DoD**: Hook 可用，能在Canvas上绘制
  - **Time**: 30min

- [ ] **T016** 创建 `lib/ritualEffects.ts` - 抹除效果
  ```typescript
  export function applyEraseEffect(
    canvas: HTMLCanvasElement,
    image: HTMLImageElement,
    maskCanvas: HTMLCanvasElement  // 用户涂抹的遮罩
  ): void
  ```
  - 涂抹区域应用马赛克/模糊
  - **DoD**: 函数可用
  - **Time**: 25min

- [ ] **T017** 创建 `components/rituals/EraseRitual.tsx`
  - 显示原图 + 涂抹层
  - 涂抹工具提示
  - 「重来」「确认」按钮
  - **DoD**: 能涂抹并看到效果
  - **Time**: 30min

- [ ] **T018** 集成抹除结果到 RitualResult
  - 复用结果组件
  - 抹除专属文案
  - **DoD**: 涂抹→确认→显示结果→下载
  - **Time**: 15min

**Phase Acceptance**: 能完成抹除全流程（涂抹→确认→下载）

---

## Phase 5: 珍藏功能 (3.5h-4.5h)

**Purpose**: 第三种仪式选项

- [ ] **T019** 创建 `lib/ritualEffects.ts` - 珍藏效果
  ```typescript
  export function applyCherishEffect(
    canvas: HTMLCanvasElement,
    image: HTMLImageElement,
    text: string
  ): void
  ```
  - 柔和滤镜
  - 文字渲染
  - **DoD**: 函数可用
  - **Time**: 20min

- [ ] **T020** 创建 `components/rituals/CherishRitual.tsx`
  - 文字输入框
  - 实时预览
  - 确认按钮
  - **DoD**: 能输入文字并预览效果
  - **Time**: 25min

- [ ] **T021** 集成珍藏结果
  - 珍藏专属文案
  - **DoD**: 输入文字→确认→显示结果→下载
  - **Time**: 15min

**Phase Acceptance**: 能完成珍藏全流程（输入文字→生成卡片→下载）

---

## Phase 6: 仪式选择器 + UI打磨 (4.5h-5.5h)

**Purpose**: 产品感和情感体验

- [ ] **T022** 创建 `components/rituals/RitualSelector.tsx`
  - 三个仪式选项卡片
  - 简短描述
  - 选中状态
  - **DoD**: 能选择仪式类型
  - **Time**: 20min

- [ ] **T023** 添加页面过渡动画 (Framer Motion)
  - 上传→选择→处理→结果 的过渡
  - **DoD**: 页面切换流畅
  - **Time**: 15min

- [ ] **T024** 可选情绪标签入口
  - 上传后显示情绪标签（可跳过）
  - 选择后仅影响文案
  - **DoD**: 情绪可选，可跳过
  - **Time**: 15min

- [ ] **T025** 移动端适配检查
  - 触摸区域足够大
  - 键盘弹出时布局正常
  - **DoD**: iPhone 上体验良好
  - **Time**: 15min

- [ ] **T026** 添加「处理另一张」按钮
  - 结果页返回首页
  - **DoD**: 可重新开始
  - **Time**: 5min

**Phase Acceptance**: 产品看起来完整、有温度

---

## Phase 7: 部署上线 (5.5h-6h)

**Purpose**: 上线可访问

- [ ] **T027** 推送代码到 GitHub
  ```bash
  git init
  git add .
  git commit -m "feat: MVP - breakup photo ritual"
  git remote add origin <repo-url>
  git push -u origin main
  ```
  - **DoD**: 代码在 GitHub
  - **Time**: 5min

- [ ] **T028** Vercel 部署
  - 连接 GitHub repo
  - 自动部署
  - **DoD**: 获得可访问的 URL
  - **Time**: 10min

- [ ] **T029** 真机测试
  - iPhone Safari 完整流程
  - **DoD**: 三个仪式都能正常完成
  - **Time**: 10min

- [ ] **T030** 修复发现的问题
  - **DoD**: 关键问题修复
  - **Time**: 5min

**Phase Acceptance**: 产品在线可用，可分享链接

---

## 紧急砍功能策略

如果时间不够，按以下顺序砍：

1. **T024 情绪标签** → 砍掉，直接显示三个选项
2. **T023 过渡动画** → 简化为基础 fade
3. **T019-T021 珍藏功能** → 整个砍掉，只保留封存+抹除
4. **T011 封条纹理** → 用 CSS 渐变替代

**底线MVP**：上传 → 封存/抹除 → 下载

---

## Dependencies

```
Phase 1 (初始化)
    ↓
Phase 2 (上传)
    ↓
┌───┴───┬───────┐
↓       ↓       ↓
Phase 3 Phase 4 Phase 5  (三个仪式)
(封存)  (抹除)  (珍藏)
└───┬───┴───────┘
    ↓
Phase 6 (打磨)
    ↓
Phase 7 (部署)
```

---

## Quick Commands

```bash
# 开发
npm run dev

# 构建
npm run build

# 部署到 Vercel
npx vercel

# 或者通过 GitHub 自动部署
git push origin main
```
