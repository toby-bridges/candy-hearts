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
  rotation: number
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

  // 生成灭霸响指粒子 - 更密集、更快、方向性更强
  const generateSnapParticles = useCallback((
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number
  ): Particle[] => {
    const newParticles: Particle[] = []
    const particleCount = 150 // 更多粒子

    for (let i = 0; i < particleCount; i++) {
      // 在圆形区域内随机位置
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * radius
      const x = centerX + Math.cos(angle) * distance
      const y = centerY + Math.sin(angle) * distance

      // 获取该位置的颜色
      const pixelX = Math.max(0, Math.min(Math.floor(x), ctx.canvas.width - 1))
      const pixelY = Math.max(0, Math.min(Math.floor(y), ctx.canvas.height - 1))
      const pixel = ctx.getImageData(pixelX, pixelY, 1, 1).data
      const color = `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, 1)`

      // 灭霸效果：向右飘散，带有随机性
      const spreadAngle = (Math.random() - 0.3) * Math.PI * 0.5 // 主要向右
      const speed = 200 + Math.random() * 300
      const targetX = x + Math.cos(spreadAngle) * speed
      const targetY = y + Math.sin(spreadAngle) * speed * 0.5

      newParticles.push({
        id: Date.now() + i + Math.random(),
        x,
        y,
        size: 2 + Math.random() * 6,
        color,
        delay: (distance / radius) * 0.5 + Math.random() * 0.3, // 从中心向外延迟
        duration: 0.8 + Math.random() * 0.6, // 更快
        targetX,
        targetY,
        rotation: Math.random() * 720 - 360, // 旋转
      })
    }

    return newParticles
  }, [])

  // 处理点击 - 灭霸响指效果
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
    const radius = Math.max(displaySize.width * 0.12, 50)

    setShowHint(false)
    setIsAnimating(true)

    // 强烈触感反馈
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50])
    }

    const ctx = canvas.getContext('2d')!

    // 生成粒子
    const newParticles = generateSnapParticles(ctx, displayX, displayY, radius)
    setParticles(newParticles)

    // 记录点击区域
    const scaleX = imageSize.width / displaySize.width
    const scaleY = imageSize.height / displaySize.height
    setClickedAreas([...clickedAreas, {
      x: displayX * scaleX,
      y: displayY * scaleY
    }])

    // 立即开始擦除该区域（渐进式）
    eraseAreaGradually(ctx, displayX, displayY, radius)

    // 动画结束后清除粒子
    setTimeout(() => {
      setParticles([])
      setIsAnimating(false)
    }, 2000)
  }

  // 渐进式擦除区域
  const eraseAreaGradually = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number
  ) => {
    const steps = 20
    let step = 0

    const animate = () => {
      if (step >= steps) return

      const progress = step / steps
      const currentRadius = radius * progress

      // 创建渐变遮罩
      ctx.save()
      ctx.beginPath()
      ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2)
      ctx.clip()

      // 用背景色（或透明）填充
      ctx.fillStyle = 'rgba(253, 248, 243, 0.15)'
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

      ctx.restore()

      step++
      requestAnimationFrame(animate)
    }

    animate()
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
        轻触他，让他灰飞烟灭
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

        {/* 灭霸粒子动画 */}
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{
                x: particle.x,
                y: particle.y,
                scale: 1,
                opacity: 1,
                rotate: 0,
              }}
              animate={{
                x: particle.targetX,
                y: particle.targetY,
                scale: 0,
                opacity: 0,
                rotate: particle.rotation,
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                ease: [0.4, 0, 0.2, 1], // 快出慢停
              }}
              className="absolute pointer-events-none"
              style={{
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
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
            className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none"
          >
            <div className="bg-black/70 px-4 py-2 rounded-full text-white text-sm">
              👆 点击让他消失
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
          💨 已消散 {clickedAreas.length} 处
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
