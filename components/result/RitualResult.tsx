'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { getRandomCopy, getRitualName } from '@/lib/copywriting'
import { downloadImage } from '@/lib/imageUtils'

interface RitualResultProps {
  image: string
  ritualType: 'seal' | 'erase' | 'cherish'
  onReset: () => void
}

export default function RitualResult({ image, ritualType, onReset }: RitualResultProps) {
  const [copy] = useState(() => getRandomCopy(ritualType))
  const [isSaving, setIsSaving] = useState(false)
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)

  // 长按开始
  const handlePressStart = () => {
    longPressTimer.current = setTimeout(() => {
      handleSave()
    }, 500)
  }

  // 长按结束
  const handlePressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  // 保存图片
  const handleSave = () => {
    setIsSaving(true)

    // 触感反馈
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }

    const ritualName = getRitualName(ritualType)
    const filename = `${ritualName}-${Date.now()}.jpg`
    downloadImage(image, filename)

    setTimeout(() => setIsSaving(false), 1000)
  }

  // 仪式颜色
  const ritualColor = {
    seal: 'ritual-seal',
    erase: 'ritual-erase',
    cherish: 'ritual-cherish',
  }[ritualType]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-sm mx-auto text-center"
    >
      {/* 完成提示 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-4"
      >
        <span className={`text-${ritualColor} text-sm`}>
          ✨ 仪式完成 ✨
        </span>
      </motion.div>

      {/* 处理后的图片 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="card-ritual overflow-hidden"
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
      >
        <img
          src={image}
          alt="处理后的照片"
          className="w-full"
          draggable={false}
        />
      </motion.div>

      {/* 治愈文案 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="font-serif text-ritual-brown text-lg mt-6 px-4"
      >
        「{copy}」
      </motion.p>

      {/* 保存提示 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-ritual-muted text-xs mt-4"
      >
        {isSaving ? '已保存 ✓' : '长按图片保存到相册'}
      </motion.p>

      {/* 操作按钮 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex gap-4 mt-6"
      >
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="flex-1 py-3 px-4 rounded-ritual border border-ritual-border text-ritual-muted"
        >
          处理另一张
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          className={`flex-1 py-3 px-4 rounded-ritual font-medium bg-${ritualColor} text-white`}
        >
          保存图片
        </motion.button>
      </motion.div>

      {/* 品牌露出 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 pt-4 border-t border-ritual-border"
      >
        <p className="text-ritual-muted text-xs">
          由「告别仪式」生成
        </p>
        <p className="text-ritual-muted text-xs opacity-60">
          candy-hearts.app
        </p>
      </motion.div>
    </motion.div>
  )
}
