import { get, set } from 'idb-keyval'

/**
 * 从 IndexedDB 中获取已收藏图片列表
 * @returns {Promise<Array<{blob: Blob, type: 'image', star: 'stared', hash: string, prompt: string}>>} 返回图片信息数组
 */
export default async function getStaredImages() {
  const staredImages = await get('staredImages')
  if (staredImages && typeof staredImages === 'object') {
    // 将已收藏图片列表转换为图片信息列表
    const initialImages = staredImages.map(image => {
      const blob = image.blob
      const hash = image.hash
      const prompt = image.prompt
      return { blob, type: 'image', star: 'stared', hash, prompt }
    })
    // 倒转并设置图片信息列表
    initialImages.reverse()
    return initialImages
  } else {
    await set('staredImages', [])
    return []
  }
}