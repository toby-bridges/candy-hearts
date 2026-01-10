'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { processUploadedFile } from '@/lib/imageUtils'

interface PhotoUploaderProps {
  onUpload: (imageDataUrl: string) => void
}

export default function PhotoUploader({ onUpload }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 验证是否是图片
    if (!file.type.startsWith('image/') && !file.name.toLowerCase().endsWith('.heic')) {
      setError('请选择图片文件')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const imageDataUrl = await processUploadedFile(file)
      onUpload(imageDataUrl)
    } catch (err) {
      console.error('图片处理失败:', err)
      setError('图片处理失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-sm mx-auto text-center"
    >
      {/* 标题 */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-serif text-ritual-brown mb-2"
      >
        告别仪式
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-ritual-muted text-sm mb-8"
      >
        有些照片，值得一个体面的告别
      </motion.p>

      {/* 上传区域 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        onClick={handleClick}
        className={`
          card-ritual p-8 cursor-pointer
          border-2 border-dashed border-ritual-border
          hover:border-ritual-accent hover:shadow-ritual-lg
          transition-all duration-300
          ${isLoading ? 'pointer-events-none opacity-70' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.heic,.heif"
          onChange={handleFileChange}
          className="hidden"
        />

        {isLoading ? (
          <div className="py-8">
            <div className="w-8 h-8 border-2 border-ritual-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-ritual-muted">处理中...</p>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-ritual-card flex items-center justify-center">
              <svg
                className="w-8 h-8 text-ritual-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-ritual-text font-medium mb-2">点击选择照片</p>
            <p className="text-ritual-muted text-sm">支持 JPG、PNG、HEIC</p>
          </>
        )}
      </motion.div>

      {/* 错误提示 */}
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 text-sm mt-4"
        >
          {error}
        </motion.p>
      )}

      {/* 隐私声明 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-ritual-muted text-xs mt-6 flex items-center justify-center gap-1"
      >
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clipRule="evenodd"
          />
        </svg>
        你的照片不会离开你的设备
      </motion.p>
    </motion.div>
  )
}
