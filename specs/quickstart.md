# Quickstart Validation: 分手照片仪式 MVP

## Purpose
验证MVP核心功能是否正常工作。

---

## Prerequisites
- [ ] 所有Phase 1-7 任务完成
- [ ] Vercel部署成功，有可访问URL
- [ ] 准备一张测试照片（任意照片即可）

---

## Scenario 1: 封存仪式 Happy Path

**Time**: ~1分钟 | **Result**: ✅ Pass / ❌ Fail

1. **打开网站首页**
   - Expected: 看到上传区域和隐私声明

2. **点击上传，选择一张照片**
   - Expected: 照片显示在预览区，出现三个仪式选项

3. **点击「封存」按钮**
   - Expected: 显示处理中，然后显示模糊+封条效果的图片

4. **点击「下载」按钮**
   - Expected: 图片下载到本地，可以打开查看

**If fails**: 检查浏览器Console是否有报错

---

## Scenario 2: 抹除仪式 Happy Path

**Time**: ~2分钟 | **Result**: ✅ Pass / ❌ Fail

1. **上传一张照片**
   - Expected: 照片预览显示

2. **点击「抹除他」按钮**
   - Expected: 进入涂抹界面，有操作提示

3. **用手指/鼠标在照片上涂抹一个区域**
   - Expected: 涂抹轨迹可见

4. **点击「确认」按钮**
   - Expected: 涂抹区域变成马赛克/模糊效果

5. **下载处理后的图片**
   - Expected: 图片下载成功，涂抹区域已处理

**If fails**: 检查touch事件是否正常绑定

---

## Scenario 3: 珍藏仪式 Happy Path

**Time**: ~1分钟 | **Result**: ✅ Pass / ❌ Fail

1. **上传一张照片**
   - Expected: 照片预览显示

2. **点击「珍藏故事」按钮**
   - Expected: 进入文字输入界面

3. **输入一句话："谢谢你来过"**
   - Expected: 预览显示照片+文字

4. **点击「确认」并下载**
   - Expected: 下载的图片包含照片和文字

---

## Scenario 4: iPhone HEIC格式

**Time**: ~1分钟 | **Result**: ✅ Pass / ❌ Fail

1. **用iPhone Safari打开网站**
   - Expected: 页面正常显示

2. **上传一张iPhone原生照片（HEIC格式）**
   - Expected: 照片正常显示，无报错

3. **完成任意仪式并下载**
   - Expected: 下载成功，图片为JPG/PNG格式

---

## Scenario 5: 大图片处理

**Time**: ~1分钟 | **Result**: ✅ Pass / ❌ Fail

1. **上传一张大图片（>5MB，4000px以上）**
   - Expected: 不卡顿，2秒内显示预览

2. **执行封存仪式**
   - Expected: 处理时间<3秒

---

## Quick Diagnostics

如果测试失败，检查：

```bash
# 本地开发环境
npx serve .
# 然后打开浏览器 http://localhost:3000

# 查看浏览器Console
# Chrome/Safari: 右键 → 检查 → Console

# 常见问题
# 1. CORS错误 → 确保使用本地服务器，不要直接打开HTML
# 2. Canvas报错 → 检查图片是否跨域
# 3. 触摸不生效 → 检查touch事件绑定
```

---

## Pass Criteria

**所有场景必须通过才能上线**

- [ ] Scenario 1: 封存 Happy Path - ✅ / ❌
- [ ] Scenario 2: 抹除 Happy Path - ✅ / ❌
- [ ] Scenario 3: 珍藏 Happy Path - ✅ / ❌
- [ ] Scenario 4: iPhone HEIC - ✅ / ❌
- [ ] Scenario 5: 大图片 - ✅ / ❌

**MVP底线**：Scenario 1 + 2 必须通过（封存+抹除）
