/**
 * 图片处理工具函数
 */

// 压缩图片到指定最大宽度
export async function compressImage(
  file: File,
  maxWidth: number = 2000
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img

        // 如果图片超过最大宽度，等比缩放
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, width, height)

        // 输出为 JPEG，质量 0.85
        resolve(canvas.toDataURL('image/jpeg', 0.85))
      }
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// 检查是否是 HEIC 格式
export function isHeicFile(file: File): boolean {
  return (
    file.type === 'image/heic' ||
    file.type === 'image/heif' ||
    file.name.toLowerCase().endsWith('.heic') ||
    file.name.toLowerCase().endsWith('.heif')
  )
}

// 转换 HEIC 到 JPEG
export async function convertHeicToJpeg(file: File): Promise<File> {
  const heic2any = (await import('heic2any')).default
  const blob = await heic2any({
    blob: file,
    toType: 'image/jpeg',
    quality: 0.85,
  })

  // heic2any 可能返回数组或单个 blob
  const resultBlob = Array.isArray(blob) ? blob[0] : blob
  return new File([resultBlob], file.name.replace(/\.heic$/i, '.jpg'), {
    type: 'image/jpeg',
  })
}

// 处理上传的图片文件
export async function processUploadedFile(file: File): Promise<string> {
  let processedFile = file

  // 如果是 HEIC 格式，先转换
  if (isHeicFile(file)) {
    processedFile = await convertHeicToJpeg(file)
  }

  // 压缩图片
  return compressImage(processedFile)
}

// 从 canvas 导出图片
export function canvasToDataUrl(
  canvas: HTMLCanvasElement,
  format: string = 'image/jpeg',
  quality: number = 0.9
): string {
  return canvas.toDataURL(format, quality)
}

// 下载图片
export function downloadImage(dataUrl: string, filename: string = 'ritual-photo.jpg') {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 加载图片到 Image 对象
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}
