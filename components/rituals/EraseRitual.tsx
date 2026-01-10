'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { applyEraseEffect } from '@/lib/ritualEffects'
import { loadImage } from '@/lib/imageUtils'

interface EraseRitualProps {
  image: string
  onComplete: (resultImage: string) => void
}

interface BlurPoint {
  x: number
  y: number
}

export default function EraseRitual({ image, onComplete }: EraseRitualProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [blurPoints, setBlurPoints] = useState<BlurPoint[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 })

  // 初始化画布
  useEffect(() => {
    const initCanvas = async () => {
      const img = await loadImage(image)
      setImageSize({ width: img.width, height: img.height })

      const canvas = canvasRef.current
      const container = containerRef.current
      if (!canvas || !container) return

      // 计算显示尺寸（适应容器）
      const maxWidth = container.clientWidth
      const maxHeight = window.innerHeight * 0.5
      let displayWidth = img.width
      let displayHeight = img.height

      if (displayWidth > maxWidth) {
        displayHeight = (displayHeight * maxWidth) / displayWidth
        displayWidth = maxWidth
      }
      if (displayHeight > maxHeight) {
        displayWidth = (displayWidth * maxHeight) / displayHeight
        displayHeight = maxHeight
      }

      setDisplaySize({ width: displayWidth, height: displayHeight })

      // 设置画布尺寸
      canvas.width = displayWidth
      canvas.height = displayHeight

      // 绘制图片
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, displayWidth, displayHeight)
    }

    initCanvas()
  }, [image])

  // 处理点击
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    let clientX: number, clientY: number

    if ('touches' in e) {
      clientX = e.changedTouches[0].clientX
      clientY = e.changedTouches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    // 显示坐标
    const displayX = clientX - rect.left
    const displayY = clientY - rect.top

    // 转换为实际图片坐标
    const scaleX = imageSize.width / displaySize.width
    const scaleY = imageSize.height / displaySize.height
    const actualX = displayX * scaleX
    const actualY = displayY * scaleY

    // 添加模糊点
    const newPoint = { x: actualX, y: actualY }
    setBlurPoints([...blurPoints, newPoint])

    // 在画布上显示预览
    const ctx = canvas.getContext('2d')!
    const radius = Math.max(displaySize.width * 0.08, 30)

    // 绘制模糊预览圆
    ctx.beginPath()
    ctx.arc(displayX, displayY, radius, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(212, 181, 160, 0.6)' // 抹除色
    ctx.fill()

    // 添加触感反馈
    if (navigator.vibrate) {
      navigator.vibrate(30)
    }
  }

  // 重来
  const handleReset = async () => {
    setBlurPoints([])
    const canvas = canvasRef.current
    if (!canvas) return

    const img = await loadImage(image)
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, displaySize.width, displaySize.height)
  }

  // 完成
  const handleConfirm = async () => {
    if (blurPoints.length === 0) {
      // 没有选择任何区域，提示用户
      return
    }

    setIsProcessing(true)
    try {
      const result = await applyEraseEffect(image, blurPoints)
      onComplete(result)
    } catch (error) {
      console.error('抹除处理失败:', error)
    }
    setIsProcessing(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-sm mx-auto"
    >
      {/* 提示 */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-ritual-muted text-sm mb-4"
      >
        点击你想模糊的地方
      </motion.p>

      {/* 画布容器 */}
      <div ref={containerRef} className="card-ritual overflow-hidden">
        <canvas
          ref={canvasRef}
          onClick={handleClick}
          onTouchEnd={handleClick}
          className="w-full cursor-crosshair"
          style={{
            width: displaySize.width || '100%',
            height: displaySize.height || 'auto',
          }}
        />
      </div>

      {/* 已选择的点数 */}
      {blurPoints.length > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-ritual-muted text-xs mt-2"
        >
          已选择 {blurPoints.length} 个区域
        </motion.p>
      )}

      {/* 操作按钮 */}
      <div className="flex gap-4 mt-6">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          disabled={isProcessing}
          className="flex-1 py-3 px-4 rounded-ritual border border-ritual-border text-ritual-muted"
        >
          重来
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleConfirm}
          disabled={isProcessing || blurPoints.length === 0}
          className={`
            flex-1 py-3 px-4 rounded-ritual font-medium
            ${blurPoints.length > 0
              ? 'bg-ritual-erase text-white'
              : 'bg-ritual-card text-ritual-muted'}
          `}
        >
          {isProcessing ? '处理中...' : '完成'}
        </motion.button>
      </div>
    </motion.div>
  )
}
