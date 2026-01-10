'use client'

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import PhotoUploader from '@/components/upload/PhotoUploader'
import SwipeCard from '@/components/rituals/SwipeCard'
import SealRitual from '@/components/rituals/SealRitual'
import EraseRitual from '@/components/rituals/EraseRitual'
import CherishRitual from '@/components/rituals/CherishRitual'
import RitualResult from '@/components/result/RitualResult'

type Stage = 'upload' | 'choose' | 'seal' | 'erase' | 'cherish' | 'result'
type RitualType = 'seal' | 'erase' | 'cherish'

export default function Home() {
  const [stage, setStage] = useState<Stage>('upload')
  const [image, setImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [ritualType, setRitualType] = useState<RitualType | null>(null)

  const handleImageUpload = (imageDataUrl: string) => {
    setImage(imageDataUrl)
    setStage('choose')
  }

  const handleSwipe = (direction: 'up' | 'down' | 'left' | 'right') => {
    switch (direction) {
      case 'up':
        setRitualType('seal')
        setStage('seal')
        break
      case 'left':
        setRitualType('erase')
        setStage('erase')
        break
      case 'right':
        setRitualType('cherish')
        setStage('cherish')
        break
      case 'down':
        // 换一张，回到上传
        setImage(null)
        setStage('upload')
        break
    }
  }

  const handleRitualComplete = (resultImage: string) => {
    setProcessedImage(resultImage)
    setStage('result')
  }

  const handleReset = () => {
    setImage(null)
    setProcessedImage(null)
    setRitualType(null)
    setStage('upload')
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {stage === 'upload' && (
          <PhotoUploader key="upload" onUpload={handleImageUpload} />
        )}

        {stage === 'choose' && image && (
          <SwipeCard key="choose" image={image} onSwipe={handleSwipe} />
        )}

        {stage === 'seal' && image && (
          <SealRitual
            key="seal"
            image={image}
            onComplete={handleRitualComplete}
          />
        )}

        {stage === 'erase' && image && (
          <EraseRitual
            key="erase"
            image={image}
            onComplete={handleRitualComplete}
          />
        )}

        {stage === 'cherish' && image && (
          <CherishRitual
            key="cherish"
            image={image}
            onComplete={handleRitualComplete}
          />
        )}

        {stage === 'result' && processedImage && ritualType && (
          <RitualResult
            key="result"
            image={processedImage}
            ritualType={ritualType}
            onReset={handleReset}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
