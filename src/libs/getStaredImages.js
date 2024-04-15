import localforage from 'localforage'

/**
 * 从 localforage 中获取已收藏图片列表
 * @returns {Promise<Array<{url: string, type: 'image', star: 'stared', hash: string, prompt: string}>>} 返回图片信息数组
 */
export default async function getStaredImages() {
  const staredImages = await localforage.getItem('staredImages')
  if (staredImages) {
    // 将已收藏图片列表转换为图片信息列表
    const initialImages = staredImages.map(image => {
      const url = URL.createObjectURL(image.blob)
      const hash = image.hash
      const prompt = image.prompt
      return { url, type: 'image', star: 'stared', hash, prompt }
    })
    // 倒转并设置图片信息列表
    initialImages.reverse()
    return initialImages
  } else {
    return []
  }
}