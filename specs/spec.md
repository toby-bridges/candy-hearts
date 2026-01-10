# Feature Specification: 分手照片仪式 (Breakup Photo Ritual)

**Feature Branch**: `001-breakup-photo-mvp`
**Created**: 2026-01-10
**Status**: Draft
**Input**: Derived from conversation history
**Hard Deadline**: 6 hours

---

## Out of Scope (v1.0)

> 6小时MVP，必须极度克制

**明确排除**:
- 用户账号/登录系统 - 无需持久化
- 后端服务器 - 纯前端实现
- AI人脸识别/自动抠图 - 技术复杂度过高
- 多张照片批量处理 - 只处理单张
- 社交分享到平台 - 隐私敏感
- 教育性内容/心理科普 - 用户明确不要"教育感"
- 付费功能 - MVP验证阶段

**Future Consideration (v2.0)**:
- AI驱动的智能人像处理
- 时间胶囊（定时解封）
- 情绪日记/追踪

---

## User Scenarios & Testing

### User Story 1 - 上传照片并选择仪式 (P1) 🎯 MVP

**As a** 刚分手的年轻女性
**I want to** 上传一张和前任的合照，选择一种处理方式
**So that** 我能用一种有仪式感的方式处理这张照片，而不是在混乱中删除或继续痛苦地保留

**Why this priority**: 核心价值主张，没有这个功能产品不存在

**Independent Test**:
- **Setup**: 打开网页，页面加载完成
- **Action**: 点击上传区域，选择一张照片
- **Expected**: 照片显示在页面上，出现处理选项
- **Cleanup**: 刷新页面

**Acceptance Scenarios**:
1. **Happy Path**: Given 用户在首页, When 上传一张JPG照片, Then 照片预览显示且出现3个处理选项
2. **Edge Case**: Given 用户上传超大图片(>10MB), When 上传完成, Then 图片被压缩后显示，不卡顿
3. **Error Case**: Given 用户上传非图片文件, When 选择文件, Then 显示友好提示"请选择图片文件"

---

### User Story 2 - 执行「封存」仪式 (P1) 🎯 MVP

**As a** 还没准备好面对但也不想删除照片的用户
**I want to** 把照片"封存"起来
**So that** 我知道它还在，但现在不用看到它

**Why this priority**: "封存"是最低技术门槛+最高情感价值的选项

**Independent Test**:
- **Setup**: 已上传一张照片
- **Action**: 点击「封存」按钮
- **Expected**: 照片变成"封存"视觉效果（模糊+封条），可下载
- **Cleanup**: 无

**Acceptance Scenarios**:
1. **Happy Path**: Given 照片已上传, When 点击封存, Then 显示封存效果+治愈文案+下载按钮
2. **Edge Case**: Given 网络慢, When 处理中, Then 显示加载状态
3. **Error Case**: N/A (纯前端处理，几乎不会失败)

**视觉效果**:
- 高斯模糊
- 叠加半透明"封条"纹理
- 可选：加上日期戳"封存于 2026.01.10"

---

### User Story 3 - 执行「抹除他」仪式 (P1) 🎯 MVP

**As a** 愤怒或想要前进的用户
**I want to** 把他从照片里"抹掉"
**So that** 我能保留这个瞬间，但不再看到他的脸

**Why this priority**: 高情感价值，解决"想删但又舍不得回忆"的矛盾

**Independent Test**:
- **Setup**: 已上传一张照片
- **Action**: 点击「抹除他」按钮
- **Expected**: 进入简单的涂抹界面，用户手动涂抹区域，涂抹部分变成艺术化遮挡
- **Cleanup**: 无

**Acceptance Scenarios**:
1. **Happy Path**: Given 照片已上传, When 点击抹除→手动涂抹→确认, Then 显示处理后效果+治愈文案+下载按钮
2. **Edge Case**: Given 用户涂抹了整张照片, When 确认, Then 正常处理（用户有完全控制权）
3. **Error Case**: Given 用户误操作, When 点击重来, Then 恢复原图重新涂抹

**视觉效果**:
- 用户手动涂抹（画笔工具）
- 涂抹区域变成：马赛克 / 艺术模糊 / 纯色块
- 保留照片其他部分清晰

---

### User Story 4 - 执行「珍藏故事」仪式 (P2)

**As a** 已经释然、想要纪念这段经历的用户
**I want to** 给这张照片加上一句话
**So that** 我能把它变成一个"故事的见证"而不是"痛苦的提醒"

**Why this priority**: P2因为情感复杂度最高，用户需要更多准备才能到达这个阶段

**Independent Test**:
- **Setup**: 已上传一张照片
- **Action**: 点击「珍藏故事」→输入一句话→确认
- **Expected**: 照片加上文字排版，变成"纪念卡片"风格，可下载
- **Cleanup**: 无

**Acceptance Scenarios**:
1. **Happy Path**: Given 照片已上传, When 选择珍藏→输入文字→确认, Then 显示卡片效果+下载按钮
2. **Edge Case**: Given 用户输入超长文字, When 确认, Then 文字自动截断或缩小字号
3. **Error Case**: Given 用户不输入任何文字, When 确认, Then 使用默认文案"谢谢你来过"

**视觉效果**:
- 照片加柔和滤镜
- 底部或侧边加文字区域
- 整体风格：纪念卡/明信片

---

### User Story 5 - 可选情绪确认 (P3)

**As a** 想要被理解的用户
**I want to** 在处理前告诉系统我现在的感受
**So that** 我感觉这个过程更懂我

**Why this priority**: P3因为是增强体验而非核心功能，6小时内可能砍掉

**Independent Test**:
- **Setup**: 已上传照片
- **Action**: 看到"你现在的感觉是？"选择一个情绪标签
- **Expected**: 页面氛围/文案微调，但不强制影响后续选择
- **Cleanup**: 无

**Acceptance Scenarios**:
1. **Happy Path**: Given 照片已上传, When 选择"愤怒", Then 文案变得更有力量感，但三个选项都仍可选
2. **Edge Case**: Given 用户跳过不选, When 直接选择处理方式, Then 正常进行
3. **Error Case**: N/A

---

## Global Edge Cases

- 用户刷新页面：所有数据丢失（可接受，MVP不做持久化）
- 用户在移动端使用：必须适配（年轻女性主要用手机）
- 用户照片中只有自己：允许（用户有完全控制权）
- 用户上传非人像照片：允许（不做限制）

---

## Requirements

### Functional Requirements

- **FR-001**: 用户必须能上传本地图片（JPG/PNG/HEIC）
- **FR-002**: 用户必须能预览上传的图片
- **FR-003**: 用户必须能选择三种处理方式之一：封存/抹除/珍藏
- **FR-004**: 「封存」必须生成模糊+封条效果的图片
- **FR-005**: 「抹除」必须提供手动涂抹功能，涂抹区域变成遮挡效果
- **FR-006**: 「珍藏」必须允许用户输入文字，生成卡片效果
- **FR-007**: 处理后的图片必须可以下载到本地
- **FR-008**: 每个仪式完成后必须显示一句治愈文案

### Non-Functional Requirements

#### 隐私与安全 (Critical)
- **NFR-SEC-001**: 所有图片处理必须在浏览器端完成，**绝不上传到服务器**
- **NFR-SEC-002**: 页面必须明确告知用户"你的照片不会离开你的设备"
- **NFR-SEC-003**: 不收集任何用户数据

#### 性能
- **NFR-PERF-001**: 首屏加载 < 3秒（3G网络）
- **NFR-PERF-002**: 图片处理 < 2秒（10MB以内图片）
- **NFR-PERF-003**: 大图片自动压缩，防止浏览器卡死

#### 用户体验
- **NFR-UX-001**: 移动端优先设计（目标用户主要用手机）
- **NFR-UX-002**: 整体视觉风格：温暖、克制、有仪式感（非冷冰冰的工具）
- **NFR-UX-003**: 文案风格：陪伴感、不说教、不judge

#### 兼容性
- **NFR-COMPAT-001**: 支持 iOS Safari / Android Chrome / 桌面主流浏览器
- **NFR-COMPAT-002**: 支持 HEIC 格式（iPhone照片）

---

## Decision Log

| ID | Decision | Rationale | Alternatives Considered | Trade-offs | Date |
|----|----------|-----------|-------------------------|------------|------|
| D001 | 纯前端实现 | 6小时限制+隐私优先 | 后端+AI处理 | 失去：智能抠图能力 | 2026-01-10 |
| D002 | 手动涂抹而非自动识别 | 技术可行性+用户控制感 | AI人脸检测 | 失去：一键抹除便捷性 | 2026-01-10 |
| D003 | 三种仪式并列呈现 | 用户有完全选择权 | 根据情绪推荐 | 失去：引导感 | 2026-01-10 |
| D004 | 不做用户账号 | MVP验证优先 | 登录+云存储 | 失去：数据持久化 | 2026-01-10 |
| D005 | 情绪选择为可选项 | 用户明确不要"教育感" | 强制情绪流程 | 失去：情绪数据收集 | 2026-01-10 |

---

## Success Criteria

### Measurable Outcomes
- **SC-001**: 用户能在 2 分钟内完成一次完整仪式（上传→处理→下载）
- **SC-002**: 页面跳出率 < 70%（用户愿意尝试）
- **SC-003**: 至少收集 10 条用户反馈（通过页面底部反馈入口）

---

**Version History**:
- v1.0 (2026-01-10): Initial spec from conversation - 6小时MVP版本
