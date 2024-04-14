/**
 * 计算图片的 hash 值
 * @param {string} url 图片的 URL
 * @returns {Promise<string>} 图片的 hash 值
 */
export default async function getHash(url) {
  // 获取当前图片的 blob 对象
  const res = await fetch(url)
  const blob = await res.blob()
  // 获取当前图片的 hash 值
  const array = await blob.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', array)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join('')
  return hash
}