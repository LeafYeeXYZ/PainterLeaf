import { get, set } from 'idb-keyval'

/**
 * 获取加载图片
 * @returns {Promise<string>} 加载图片的 URL
 */
export default async function getLoadingImage() {
  // 首先尝试从 IndexedDB 中获取加载图片
  const loadingImage = await get('loadingImage')
  // 如果不存在则向服务器请求
  if (!loadingImage || typeof loadingImage !== 'object') {
    const res = await fetch('/loading.gif')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    await set('loadingImage', blob)
    return url
  } else {
    const url = URL.createObjectURL(loadingImage)
    return url
  }
}