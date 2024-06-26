/** 计算图片的 hash 值 */
export default async function getHash(blob: Blob): Promise<string> {
  const array = await blob.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', array)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join('')
  return hash
}