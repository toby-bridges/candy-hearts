/**
 * 仪式效果处理函数
 */

import { loadImage } from './imageUtils'

// 获取今天的日期字符串
function getTodayString(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

/**
 * 封存效果：模糊 + 封条 + 日期戳
 */
export async function applySealEffect(imageSrc: string): Promise<string> {
  const img = await loadImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  canvas.width = img.width
  canvas.height = img.height

  // 1. 绘制模糊图片
  ctx.filter = 'blur(20px)'
  ctx.drawImage(img, 0, 0)
  ctx.filter = 'none'

  // 2. 添加半透明遮罩
  ctx.fillStyle = 'rgba(184, 197, 214, 0.3)' // 封存蓝色调
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 3. 绘制封条效果
  const sealHeight = canvas.height * 0.15
  const sealY = canvas.height * 0.42

  // 封条背景
  ctx.fillStyle = 'rgba(253, 248, 243, 0.95)'
  ctx.fillRect(0, sealY, canvas.width, sealHeight)

  // 封条边框线
  ctx.strokeStyle = '#D4A574'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(0, sealY)
  ctx.lineTo(canvas.width, sealY)
  ctx.moveTo(0, sealY + sealHeight)
  ctx.lineTo(canvas.width, sealY + sealHeight)
  ctx.stroke()

  // 4. 封存文字
  const fontSize = Math.max(canvas.width * 0.04, 16)
  ctx.font = `${fontSize}px "Noto Serif SC", serif`
  ctx.fillStyle = '#8B7355'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('已封存', canvas.width / 2, sealY + sealHeight * 0.4)

  // 日期
  ctx.font = `${fontSize * 0.7}px "Noto Sans SC", sans-serif`
  ctx.fillStyle = '#9CA3AF'
  ctx.fillText(getTodayString(), canvas.width / 2, sealY + sealHeight * 0.7)

  return canvas.toDataURL('image/jpeg', 0.9)
}

/**
 * 抹除效果：在指定位置应用马赛克
 */
export async function applyEraseEffect(
  imageSrc: string,
  blurPoints: Array<{ x: number; y: number }>
): Promise<string> {
  const img = await loadImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  canvas.width = img.width
  canvas.height = img.height

  // 绘制原图
  ctx.drawImage(img, 0, 0)

  // 对每个点应用模糊圆
  const radius = Math.max(canvas.width * 0.08, 40) // 模糊半径

  for (const point of blurPoints) {
    // 缩放坐标（因为显示尺寸可能和实际尺寸不同）
    const x = point.x
    const y = point.y

    // 使用马赛克效果
    applyMosaicCircle(ctx, x, y, radius)
  }

  return canvas.toDataURL('image/jpeg', 0.9)
}

/**
 * 在指定位置应用圆形马赛克
 */
function applyMosaicCircle(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number
) {
  const blockSize = Math.max(radius / 5, 8)

  // 获取圆形区域的边界
  const startX = Math.max(0, centerX - radius)
  const startY = Math.max(0, centerY - radius)
  const endX = Math.min(ctx.canvas.width, centerX + radius)
  const endY = Math.min(ctx.canvas.height, centerY + radius)

  // 遍历每个马赛克块
  for (let x = startX; x < endX; x += blockSize) {
    for (let y = startY; y < endY; y += blockSize) {
      // 检查是否在圆内
      const dx = x + blockSize / 2 - centerX
      const dy = y + blockSize / 2 - centerY
      if (dx * dx + dy * dy > radius * radius) continue

      // 获取这个块的平均颜色
      const blockW = Math.min(blockSize, endX - x)
      const blockH = Math.min(blockSize, endY - y)
      const imageData = ctx.getImageData(x, y, blockW, blockH)
      const avgColor = getAverageColor(imageData)

      // 填充马赛克块
      ctx.fillStyle = `rgb(${avgColor.r}, ${avgColor.g}, ${avgColor.b})`
      ctx.fillRect(x, y, blockW, blockH)
    }
  }
}

/**
 * 获取 ImageData 的平均颜色
 */
function getAverageColor(imageData: ImageData): { r: number; g: number; b: number } {
  const data = imageData.data
  let r = 0, g = 0, b = 0, count = 0

  for (let i = 0; i < data.length; i += 4) {
    r += data[i]
    g += data[i + 1]
    b += data[i + 2]
    count++
  }

  return {
    r: Math.round(r / count),
    g: Math.round(g / count),
    b: Math.round(b / count),
  }
}

/**
 * 珍藏效果：柔和滤镜 + 文字
 */
export async function applyCherishEffect(
  imageSrc: string,
  text: string = '谢谢你来过'
): Promise<string> {
  const img = await loadImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  canvas.width = img.width
  canvas.height = img.height

  // 1. 绘制原图并应用柔和滤镜
  ctx.filter = 'saturate(0.9) brightness(1.05) contrast(0.95)'
  ctx.drawImage(img, 0, 0)
  ctx.filter = 'none'

  // 2. 添加暖色调叠加
  ctx.fillStyle = 'rgba(201, 184, 168, 0.1)' // 珍藏奶茶色
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 3. 底部文字区域
  const textAreaHeight = canvas.height * 0.18
  const textAreaY = canvas.height - textAreaHeight

  // 渐变背景
  const gradient = ctx.createLinearGradient(0, textAreaY - 20, 0, canvas.height)
  gradient.addColorStop(0, 'rgba(253, 248, 243, 0)')
  gradient.addColorStop(0.3, 'rgba(253, 248, 243, 0.85)')
  gradient.addColorStop(1, 'rgba(253, 248, 243, 0.95)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, textAreaY - 20, canvas.width, textAreaHeight + 20)

  // 4. 绘制文字
  const fontSize = Math.max(canvas.width * 0.05, 18)
  ctx.font = `${fontSize}px "Noto Serif SC", serif`
  ctx.fillStyle = '#8B7355'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // 添加引号效果
  ctx.fillText(`「${text}」`, canvas.width / 2, textAreaY + textAreaHeight * 0.5)

  // 5. 日期
  ctx.font = `${fontSize * 0.5}px "Noto Sans SC", sans-serif`
  ctx.fillStyle = '#9CA3AF'
  ctx.fillText(getTodayString(), canvas.width / 2, textAreaY + textAreaHeight * 0.8)

  return canvas.toDataURL('image/jpeg', 0.9)
}
