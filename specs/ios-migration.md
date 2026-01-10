# iOS Migration Plan: 分手照片仪式

**Created**: 2026-01-10
**Status**: Future Planning
**Prerequisite**: Web MVP验证成功后启动

---

## 迁移时机判断

### 启动iOS开发的信号
- [ ] Web版日活 > 1,000
- [ ] 用户反馈中"希望有App"出现 > 20次
- [ ] 核心功能稳定，bug率 < 1%
- [ ] 有明确的付费转化数据

### 不启动的信号
- Web版留存 < 10%（产品本身有问题）
- 用户反馈集中在功能而非平台
- 没有iOS开发资源/预算

---

## 技术路线选择

### 方案对比

| 方案 | 开发成本 | 性能 | 代码复用 | 学习曲线 | 推荐度 |
|------|----------|------|----------|----------|--------|
| **React Native + Expo** | 中 | 良 | 高(80%) | 低(你会React) | ⭐⭐⭐⭐⭐ |
| Flutter | 中 | 优 | 低(重写) | 高(Dart) | ⭐⭐⭐ |
| SwiftUI Native | 高 | 优 | 低(重写) | 高(Swift) | ⭐⭐ |
| PWA | 低 | 中 | 极高(99%) | 无 | ⭐⭐⭐⭐ |
| Capacitor | 低 | 中 | 高(90%) | 低 | ⭐⭐⭐⭐ |

### 推荐：React Native + Expo

**原因**：
1. 你已熟悉 React/Next.js，迁移成本最低
2. Expo 提供开箱即用的图片处理、相机访问
3. 热更新能力，无需每次通过App Store审核
4. 社区成熟，问题容易找到答案
5. 可逐步迁移，先做简单版本

---

## 代码复用策略

### 可直接复用（~60%）

| 模块 | Web版 | RN版 | 复用方式 |
|------|-------|------|----------|
| 业务逻辑 | `lib/*.ts` | 直接复用 | 纯TS，无DOM依赖 |
| 状态管理 | React hooks | 直接复用 | useState/useReducer |
| 文案库 | `lib/copywriting.ts` | 直接复用 | 纯数据 |
| API调用 | fetch | 直接复用 | 标准API |
| 类型定义 | `types/*.ts` | 直接复用 | TypeScript |

### 需要适配（~30%）

| 模块 | Web版 | RN版 | 适配方式 |
|------|-------|------|----------|
| 样式 | Tailwind CSS | NativeWind | 语法基本相同 |
| 图片处理 | Canvas API | expo-image-manipulator | 封装抽象层 |
| 涂抹画布 | Canvas 2D | react-native-canvas / Skia | 重写交互层 |
| 文件选择 | input[type=file] | expo-image-picker | 封装抽象层 |
| 动画 | Framer Motion | Reanimated | API不同，需重写 |

### 需要重写（~10%）

| 模块 | 原因 |
|------|------|
| 布局组件 | View/Text vs div/span |
| 导航 | React Navigation vs Next.js routing |
| 存储 | AsyncStorage vs localStorage |

---

## 架构设计：共享核心

```
monorepo/
├── packages/
│   ├── core/                    # 共享核心（纯TS）
│   │   ├── lib/
│   │   │   ├── copywriting.ts   # 文案
│   │   │   ├── imageProcessor.ts # 图片处理抽象接口
│   │   │   └── ritualLogic.ts   # 仪式业务逻辑
│   │   ├── types/
│   │   │   └── index.ts         # 共享类型
│   │   └── hooks/
│   │       └── useRitualState.ts # 状态管理
│   │
│   ├── web/                     # Next.js Web App
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   │       └── imageProcessor.web.ts  # Canvas实现
│   │
│   └── mobile/                  # React Native App
│       ├── app/
│       ├── components/
│       └── lib/
│           └── imageProcessor.native.ts  # Expo实现
│
├── package.json                 # Workspace配置
└── turbo.json                   # Turborepo配置（可选）
```

### 抽象层示例

```typescript
// packages/core/lib/imageProcessor.ts
export interface ImageProcessor {
  compress(uri: string, maxWidth: number): Promise<string>;
  applyBlur(uri: string, radius: number): Promise<string>;
  applyMosaic(uri: string, mask: MaskData): Promise<string>;
  addText(uri: string, text: string, position: Position): Promise<string>;
  exportAsDataUrl(uri: string): Promise<string>;
}

// packages/web/lib/imageProcessor.web.ts
export class WebImageProcessor implements ImageProcessor {
  async applyBlur(uri: string, radius: number): Promise<string> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.filter = `blur(${radius}px)`;
    // ... Canvas实现
  }
}

// packages/mobile/lib/imageProcessor.native.ts
import * as ImageManipulator from 'expo-image-manipulator';

export class NativeImageProcessor implements ImageProcessor {
  async applyBlur(uri: string, radius: number): Promise<string> {
    // Expo实现，或使用react-native-image-filter-kit
  }
}
```

---

## 迁移阶段

### Phase 1: 准备工作（在Web MVP完成后）

**时间**: 1-2周

- [ ] 重构Web代码，提取共享核心到 `packages/core`
- [ ] 定义 ImageProcessor 抽象接口
- [ ] 搭建 monorepo 结构（pnpm workspace 或 npm workspaces）
- [ ] 确保 Web 版仍正常运行

**验收**: Web版从 monorepo 构建并正常工作

---

### Phase 2: Expo 项目初始化

**时间**: 1周

```bash
# 在 packages/ 下创建 Expo 项目
npx create-expo-app mobile --template blank-typescript
cd mobile
npx expo install expo-image-picker expo-image-manipulator expo-file-system
npx expo install nativewind tailwindcss
```

- [ ] 初始化 Expo 项目
- [ ] 配置 NativeWind（Tailwind for RN）
- [ ] 配置路径别名指向 `packages/core`
- [ ] 创建基础导航结构

**验收**: App能启动，显示Hello World

---

### Phase 3: 核心功能移植

**时间**: 2-3周

#### Week 1: 上传 + 封存
- [ ] 实现图片选择（expo-image-picker）
- [ ] 实现 NativeImageProcessor.applyBlur
- [ ] 移植 SealRitual 组件
- [ ] 实现图片保存到相册

#### Week 2: 抹除功能
- [ ] 研究 react-native-canvas 或 Skia
- [ ] 实现触摸涂抹功能
- [ ] 实现 NativeImageProcessor.applyMosaic
- [ ] 移植 EraseRitual 组件

#### Week 3: 珍藏 + 打磨
- [ ] 实现 NativeImageProcessor.addText
- [ ] 移植 CherishRitual 组件
- [ ] 动画效果（Reanimated）
- [ ] UI打磨

**验收**: 三个仪式都能在iOS模拟器上完成

---

### Phase 4: iOS特有功能

**时间**: 1-2周

| 功能 | 实现方式 | 优先级 |
|------|----------|--------|
| 相册集成 | expo-media-library | P1 |
| 分享到社交 | expo-sharing | P2 |
| Widget（锁屏小组件） | Native Module | P3 |
| 通知（时间胶囊提醒） | expo-notifications | P2 |
| 深色模式 | useColorScheme | P2 |
| 触感反馈 | expo-haptics | P3 |

---

### Phase 5: 上架准备

**时间**: 1-2周

- [ ] Apple Developer 账号（¥688/年）
- [ ] 准备App Store素材
  - App图标（1024x1024）
  - 截图（6.5寸、5.5寸）
  - 描述文案
  - 隐私政策URL
- [ ] TestFlight 内测
- [ ] 提交审核

**审核注意事项**：
- 强调本地处理，不收集用户照片
- 准备好回答"为什么需要相册权限"
- 确保没有诱导付费的界面

---

## 技术风险与应对

| 风险 | 可能性 | 影响 | 应对 |
|------|--------|------|------|
| Canvas涂抹在RN上性能差 | 高 | 高 | 备选方案：Skia，或简化为矩形选区 |
| 图片处理库不支持某效果 | 中 | 中 | 使用 Native Module 调用 Core Image |
| App Store审核被拒 | 中 | 中 | 提前研究审核指南，准备申诉材料 |
| Expo更新导致兼容问题 | 低 | 中 | 锁定版本，谨慎升级 |

---

## 涂抹功能技术方案

> 这是迁移中最复杂的部分，单独说明

### 方案A: react-native-canvas（推荐先尝试）
```bash
npm install react-native-canvas
```
- 优点：API与Web Canvas相似
- 缺点：性能一般，维护不活跃
- 适用：简单涂抹场景

### 方案B: react-native-skia（高性能）
```bash
npx expo install @shopify/react-native-skia
```
- 优点：高性能，Shopify维护
- 缺点：学习曲线陡峭
- 适用：复杂绑定效果

### 方案C: 简化交互
- 不做自由涂抹
- 改为"点击选择区域"或"矩形框选"
- 降低实现难度，验证核心价值

**建议**: 先用方案C快速上线，收集反馈后再决定是否升级到方案A/B

---

## 时间线总览

```
Web MVP ─────────────────────────────────────────────────────────>
    │
    ├── +1 month: 验证Web数据，决定是否启动iOS
    │
    ├── +2 month: Phase 1-2 完成（准备+初始化）
    │
    ├── +4 month: Phase 3 完成（核心功能）
    │
    ├── +5 month: Phase 4 完成（iOS特有）
    │
    ├── +6 month: Phase 5 完成（上架）
    │
    └── 持续: 双端同步迭代
```

**总预估**: Web MVP后 5-6个月上线iOS

---

## 成本预估

| 项目 | 费用 | 说明 |
|------|------|------|
| Apple Developer | ¥688/年 | 必须 |
| 测试设备 | ¥0-5000 | 有Mac可用模拟器，或买二手iPhone |
| 第三方服务 | ¥0 | Expo免费足够 |
| 设计资源 | ¥500-2000 | App图标、截图设计 |

**最低成本**: ¥688（只需开发者账号）

---

## 学习资源

### React Native + Expo
- [Expo 官方文档](https://docs.expo.dev/)
- [React Native 中文网](https://reactnative.cn/)
- [Expo Router 文档](https://expo.github.io/router/docs)

### NativeWind（Tailwind for RN）
- [NativeWind 文档](https://www.nativewind.dev/)

### 图片处理
- [expo-image-manipulator](https://docs.expo.dev/versions/latest/sdk/imagemanipulator/)
- [react-native-skia](https://shopify.github.io/react-native-skia/)

### 动画
- [Reanimated 文档](https://docs.swmansion.com/react-native-reanimated/)
