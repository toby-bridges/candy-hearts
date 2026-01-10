'use client'

import { useState } from 'react'
import { motion, useAnimation, PanInfo } from 'framer-motion'

interface SwipeCardProps {
  image: string
  onSwipe: (direction: 'up' | 'down' | 'left' | 'right') => void
}

export default function SwipeCard({ image, onSwipe }: SwipeCardProps) {
  const controls = useAnimation()
  const [showGuide, setShowGuide] = useState(true)
  const [dragDirection, setDragDirection] = useState<string | null>(null)

  const handleDrag = (event: any, info: PanInfo) => {
    const { offset } = info

    // 判断当前拖动方向
    if (Math.abs(offset.y) > Math.abs(offset.x)) {
      setDragDirection(offset.y < 0 ? 'up' : 'down')
    } else {
      setDragDirection(offset.x < 0 ? 'left' : 'right')
    }
  }

  const handleDragEnd = async (event: any, info: PanInfo) => {
    const { offset, velocity } = info
    const threshold = 100
    const velocityThreshold = 500

    // 隐藏引导
    setShowGuide(false)

    // 判断滑动方向
    if (offset.y < -threshold || velocity.y < -velocityThreshold) {
      await controls.start({ y: -1000, opacity: 0, transition: { duration: 0.3 } })
      onSwipe('up')
    } else if (offset.y > threshold || velocity.y > velocityThreshold) {
      await controls.start({ y: 1000, opacity: 0, transition: { duration: 0.3 } })
      onSwipe('down')
    } else if (offset.x < -threshold || velocity.x < -velocityThreshold) {
      await controls.start({ x: -1000, opacity: 0, transition: { duration: 0.3 } })
      onSwipe('left')
    } else if (offset.x > threshold || velocity.x > velocityThreshold) {
      await controls.start({ x: 1000, opacity: 0, transition: { duration: 0.3 } })
      onSwipe('right')
    } else {
      // 弹回原位
      controls.start({ x: 0, y: 0, transition: { type: 'spring', stiffness: 300 } })
      setDragDirection(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="w-full max-w-sm mx-auto"
    >
      {/* 方向指示器 */}
      <div className="relative">
        {/* 上：封存 */}
        <motion.div
          animate={{ opacity: dragDirection === 'up' ? 1 : 0.3 }}
          className="absolute -top-16 left-1/2 -translate-x-1/2 text-center"
        >
          <div className="text-ritual-seal text-2xl mb-1">↑</div>
          <div className="text-ritual-seal text-sm font-medium">封存</div>
        </motion.div>

        {/* 左：抹除 */}
        <motion.div
          animate={{ opacity: dragDirection === 'left' ? 1 : 0.3 }}
          className="absolute top-1/2 -left-16 -translate-y-1/2 text-center"
        >
          <div className="text-ritual-erase text-2xl mb-1">←</div>
          <div className="text-ritual-erase text-sm font-medium">抹除</div>
        </motion.div>

        {/* 右：珍藏 */}
        <motion.div
          animate={{ opacity: dragDirection === 'right' ? 1 : 0.3 }}
          className="absolute top-1/2 -right-16 -translate-y-1/2 text-center"
        >
          <div className="text-ritual-cherish text-2xl mb-1">→</div>
          <div className="text-ritual-cherish text-sm font-medium">珍藏</div>
        </motion.div>

        {/* 下：换一张 */}
        <motion.div
          animate={{ opacity: dragDirection === 'down' ? 1 : 0.3 }}
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center"
        >
          <div className="text-ritual-muted text-2xl mb-1">↓</div>
          <div className="text-ritual-muted text-sm font-medium">换一张</div>
        </motion.div>

        {/* 可滑动的卡片 */}
        <motion.div
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.7}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          animate={controls}
          whileDrag={{ scale: 1.02 }}
          className="card-ritual overflow-hidden cursor-grab active:cursor-grabbing"
        >
          <img
            src={image}
            alt="待处理的照片"
            className="w-full aspect-square object-cover"
            draggable={false}
          />
        </motion.div>
      </div>

      {/* 首次引导 */}
      {showGuide && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6"
        >
          <p className="text-ritual-muted text-sm">
            滑动照片，选择你想做的事
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
