'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { applyCherishEffect } from '@/lib/ritualEffects'

interface CherishRitualProps {
  image: string
  onComplete: (resultImage: string) => void
}

const defaultTexts = [
  '谢谢你来过',
  '曾经很美好',
  '这段时光，值得铭记',
  '感谢相遇',
]

export default function CherishRitual({ image, onComplete }: CherishRitualProps) {
  const [text, setText] = useState(defaultTexts[0])
  const [isEditing, setIsEditing] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleTextClick = () => {
    setIsEditing(true)
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }

  const handleTextBlur = () => {
    setIsEditing(false)
    if (!text.trim()) {
      setText(defaultTexts[0])
    }
  }

  const handleConfirm = async () => {
    setIsProcessing(true)
    try {
      const result = await applyCherishEffect(image, text)
      onComplete(result)
    } catch (error) {
      console.error('珍藏处理失败:', error)
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
      {/* 预览卡片 */}
      <div className="card-ritual overflow-hidden">
        {/* 图片 */}
        <div className="relative">
          <img
            src={image}
            alt="珍藏的照片"
            className="w-full aspect-square object-cover"
            style={{
              filter: 'saturate(0.9) brightness(1.05) contrast(0.95)',
            }}
          />

          {/* 文字区域预览 */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ritual-warm/95 to-transparent p-4 pt-8">
            {isEditing ? (
              <input
                type="text"
                value={text}
                onChange={handleTextChange}
                onBlur={handleTextBlur}
                autoFocus
                maxLength={20}
                className="w-full text-center font-serif text-ritual-brown text-lg bg-transparent border-b border-ritual-accent outline-none"
                placeholder="写下你想说的话"
              />
            ) : (
              <motion.p
                onClick={handleTextClick}
                whileTap={{ scale: 0.98 }}
                className="text-center font-serif text-ritual-brown text-lg cursor-pointer"
              >
                「{text}」
              </motion.p>
            )}
          </div>
        </div>
      </div>

      {/* 提示 */}
      <p className="text-center text-ritual-muted text-xs mt-3">
        点击文字可以编辑
      </p>

      {/* 快捷文案 */}
      <div className="flex flex-wrap gap-2 justify-center mt-4">
        {defaultTexts.map((t) => (
          <motion.button
            key={t}
            whileTap={{ scale: 0.95 }}
            onClick={() => setText(t)}
            className={`
              px-3 py-1 text-xs rounded-full border
              ${text === t
                ? 'border-ritual-cherish bg-ritual-cherish/10 text-ritual-brown'
                : 'border-ritual-border text-ritual-muted'}
            `}
          >
            {t}
          </motion.button>
        ))}
      </div>

      {/* 确认按钮 */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleConfirm}
        disabled={isProcessing}
        className="w-full mt-6 py-3 px-4 rounded-ritual font-medium bg-ritual-cherish text-white"
      >
        {isProcessing ? '处理中...' : '完成'}
      </motion.button>
    </motion.div>
  )
}
