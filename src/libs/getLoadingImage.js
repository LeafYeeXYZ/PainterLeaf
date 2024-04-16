import { get, set } from 'idb-keyval'

/**
 * 获取加载图片
 * @returns {Promise<{
 *  blob: Blob,
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
    return {
      blob,
      type: 'loading',
      star: false,
      hash: 'loading',
      prompt: 'loading'
    }
  } else {
    return {
      blob: loadingImage,
      type: 'loading',
      star: false,
      hash: 'loading',
      prompt: 'loading'
    }
  }
}