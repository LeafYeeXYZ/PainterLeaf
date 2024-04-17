import { get, set } from 'idb-keyval'
import { blobToBase64 } from './base64_blob'

/**
 * 获取加载图片
 * @returns {Promise<{
 *  base64: string,
 *  type: 'loading',
 *  star: false,
 *  hash: 'loading',
 *  prompt: 'loading'
 * }>} 加载图片对象
 */
export default async function getLoadingImage() {
  // 首先尝试从 IndexedDB 中获取加载图片
  const loadingImage = await get('loadingImage')
  // 如果不存在则向服务器请求
  if (!loadingImage || typeof loadingImage !== 'object') {
    const res = await fetch('/loading.gif')
    const blob = await res.blob()
    await set('loadingImage', blob)
    const base64 = await blobToBase64(blob)
    return {
      base64,
      type: 'loading',
      star: false,
      hash: 'loading',
      prompt: 'loading'
    }
  } else {
    const base64 = await blobToBase64(loadingImage)
    return {
      base64,
      type: 'loading',
      star: false,
      hash: 'loading',
      prompt: 'loading'
    }
  }
}