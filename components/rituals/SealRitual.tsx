'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { applySealEffect } from '@/lib/ritualEffects'

interface SealRitualProps {
  image: string
  onComplete: (resultImage: string) => void
}

export default function SealRitual({ image, onComplete }: SealRitualProps) {
  const [isProcessing, setIsProcessing] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const processImage = async () => {
      // 模拟进度（增加仪式感）
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 100)

      try {
        const result = await applySealEffect(image)
        clearInterval(progressInterval)
        setProgress(100)

        // 短暂延迟，让用户看到100%
        setTimeout(() => {
          onComplete(result)
        }, 300)
      } catch (error) {
        console.error('封存处理失败:', error)
        clearInterval(progressInterval)
      }
    }

    processImage()
  }, [image, onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-sm mx-auto text-center"
    >
      {/* 处理中的动画 */}
      <div className="card-ritual p-8">
        {/* 呼吸灯效果的图片 */}
        <motion.div
          animate={{
            opacity: [0.5, 0.8, 0.5],
            filter: ['blur(10px)', 'blur(20px)', 'blur(10px)'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-32 h-32 mx-auto mb-6 rounded-ritual overflow-hidden"
        >
          <img
            src={image}
            alt="处理中"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* 进度条 */}
        <div className="w-full h-1 bg-ritual-card rounded-full overflow-hidden mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-ritual-seal"
          />
        </div>

        {/* 状态文字 */}
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-ritual-muted"
        >
          正在封存这份回忆...
        </motion.p>
      </div>
    </motion.div>
  )
}
