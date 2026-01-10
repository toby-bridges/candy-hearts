'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { loadImage } from '@/lib/imageUtils'

interface EraseRitualProps {
  image: string
  onComplete: (resultImage: string) => void
}

interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
  delay: number
  duration: number
  targetX: number
  targetY: number
}

export default function EraseRitual({ image, onComplete }: EraseRitualProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [particles, setParticles] = useState<Particle[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 })
  const [clickedAreas, setClickedAreas] = useState<Array<{ x: number; y: number }>>([])
  const [showHint, setShowHint] = useState(true)

  // 初始化画布
  useEffect(() => {
    const initCanvas = async () => {
      const img = await loadImage(image)
      setImageSize({ width: img.width, height: img.height })

      const canvas = canvasRef.current
      const container = containerRef.current
      if (!canvas || !container) return

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
      canvas.width = displayWidth
      canvas.height = displayHeight

      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, displayWidth, displayHeight)
    }

    initCanvas()
  }, [image])

  // 生成蒲公英粒子
  const generateDandelionParticles = useCallback((
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number
  ): Particle[] => {
    const newParticles: Particle[] = []
    const particleCount = 60 // 粒子数量

    for (let i = 0; i < particleCount; i++) {
      // 在圆形区域内随机位置
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * radius
      const x = centerX + Math.cos(angle) * distance
      const y = centerY + Math.sin(angle) * distance

      // 获取该位置的颜色
      const pixel = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data
      const color = `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, 0.8)`

      // 蒲公英飘散方向：主要向上，带有随机水平偏移
      const targetX = x + (Math.random() - 0.5) * 300
      const targetY = y - 150 - Math.random() * 200 // 向上飘

      newParticles.push({
        id: Date.now() + i,
        x,
        y,
        size: 3 + Math.random() * 5,
        color,
        delay: Math.random() * 0.8, // 随机延迟，产生飘散感
        duration: 1.5 + Math.random() * 1, // 随机时长
        targetX,
        targetY,
      })
    }

    return newParticles
  }, [])

  // 处理点击 - 生成蒲公英效果
  const handleClick = async (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (isAnimating) return

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

    const displayX = clientX - rect.left
    const displayY = clientY - rect.top
    const radius = Math.max(displaySize.width * 0.1, 40)

    setShowHint(false)
    setIsAnimating(true)

    // 触感反馈
    if (navigator.vibrate) {
      navigator.vibrate(30)
    }

    const ctx = canvas.getContext('2d')!

    // 生成粒子
    const newParticles = generateDandelionParticles(ctx, displayX, displayY, radius)
    setParticles(newParticles)

    // 记录点击区域（用于最终图片处理）
    const scaleX = imageSize.width / displaySize.width
    const scaleY = imageSize.height / displaySize.height
    setClickedAreas([...clickedAreas, {
      x: displayX * scaleX,
      y: displayY * scaleY
    }])

    // 在画布上柔和地模糊该区域
    setTimeout(() => {
      softBlurArea(ctx, displayX, displayY, radius)
    }, 800)

    // 动画结束后清除粒子
    setTimeout(() => {
      setParticles([])
      setIsAnimating(false)
    }, 3000)
  }

  // 柔和模糊区域
  const softBlurArea = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number
  ) => {
    // 创建临时画布进行模糊
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = ctx.canvas.width
    tempCanvas.height = ctx.canvas.height
    const tempCtx = tempCanvas.getContext('2d')!

    // 复制当前画布
    tempCtx.drawImage(ctx.canvas, 0, 0)

    // 在原画布上绘制模糊效果
    ctx.save()

    // 创建圆形裁剪区域
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.clip()

    // 应用模糊
    ctx.filter = 'blur(20px)'
    ctx.drawImage(tempCanvas, 0, 0)
    ctx.filter = 'none'

    // 叠加柔和的暖色调
    ctx.fillStyle = 'rgba(253, 248, 243, 0.3)'
    ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2)

    ctx.restore()
  }

  // 重来
  const handleReset = async () => {
    setParticles([])
    setClickedAreas([])
    setIsAnimating(false)
    setShowHint(true)

    const canvas = canvasRef.current
    if (!canvas) return

    const img = await loadImage(image)
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, displaySize.width, displaySize.height)
  }

  // 完成
  const handleConfirm = async () => {
    if (clickedAreas.length === 0) return

    setIsProcessing(true)

    // 直接使用当前画布状态作为结果
    const canvas = canvasRef.current
    if (canvas) {
      const resultImage = canvas.toDataURL('image/jpeg', 0.9)
      onComplete(resultImage)
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
        轻触他，让他随风而去
      </motion.p>

      {/* 画布容器 */}
      <div ref={containerRef} className="card-ritual overflow-hidden relative">
        <canvas
          ref={canvasRef}
          onClick={handleClick}
          onTouchEnd={handleClick}
          className="w-full cursor-pointer"
          style={{
            width: displaySize.width || '100%',
            height: displaySize.height || 'auto',
          }}
        />

        {/* 蒲公英粒子动画 */}
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{
                x: particle.x,
                y: particle.y,
                scale: 1,
                opacity: 1,
              }}
              animate={{
                x: particle.targetX,
                y: particle.targetY,
                scale: 0,
                opacity: 0,
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                ease: [0.25, 0.46, 0.45, 0.94], // 柔和的缓动
              }}
              className="absolute pointer-events-none"
              style={{
                width: particle.size,
                height: particle.size,
                borderRadius: '50%',
                backgroundColor: particle.color,
                boxShadow: `0 0 ${particle.size}px ${particle.color}`,
                left: 0,
                top: 0,
              }}
            />
          ))}
        </AnimatePresence>

        {/* 首次点击提示 */}
        {showHint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/10 pointer-events-none"
          >
            <div className="bg-white/90 px-4 py-2 rounded-full text-ritual-muted text-sm">
              👆 轻触想要消散的地方
            </div>
          </motion.div>
        )}
      </div>

      {/* 已处理提示 */}
      {clickedAreas.length > 0 && !isAnimating && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-ritual-erase text-xs mt-2"
        >
          ✨ 已随风飘散 {clickedAreas.length} 处
        </motion.p>
      )}

      {/* 操作按钮 */}
      <div className="flex gap-4 mt-6">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          disabled={isProcessing || isAnimating}
          className="flex-1 py-3 px-4 rounded-ritual border border-ritual-border text-ritual-muted"
        >
          重来
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleConfirm}
          disabled={isProcessing || isAnimating || clickedAreas.length === 0}
          className={`
            flex-1 py-3 px-4 rounded-ritual font-medium
            ${clickedAreas.length > 0 && !isAnimating
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
