/**
 * 治愈文案库
 */

export const sealCopywriting = [
  '有些东西，现在不看不代表忘记。',
  '封存不是逃避，是给自己时间。',
  '等你准备好了，它还会在这里。',
  '有些回忆，需要时间去消化。',
  '暂时看不见，不代表不存在。',
  '给自己一个缓冲的空间。',
]

export const eraseCopywriting = [
  '留下的是回忆，抹去的是他的位置。',
  '你有权决定谁出现在你的故事里。',
  '这张照片里，最重要的人是你。',
  '风景还在，你也还在。',
  '有些人，只是路过。',
  '照片是你的，故事也是你的。',
]

export const cherishCopywriting = [
  '感谢这段经历，让你成为了现在的你。',
  '不是所有结束都是遗憾。',
  '谢谢你来过。',
  '有些故事，值得被温柔地记住。',
  '这段时光，是你生命的一部分。',
  '曾经的美好，不会因为结束而消失。',
]

/**
 * 获取随机文案
 */
export function getRandomCopy(type: 'seal' | 'erase' | 'cherish'): string {
  const copyMap = {
    seal: sealCopywriting,
    erase: eraseCopywriting,
    cherish: cherishCopywriting,
  }

  const copies = copyMap[type]
  return copies[Math.floor(Math.random() * copies.length)]
}

/**
 * 获取仪式名称
 */
export function getRitualName(type: 'seal' | 'erase' | 'cherish'): string {
  const names = {
    seal: '封存',
    erase: '抹除',
    cherish: '珍藏',
  }
  return names[type]
}
