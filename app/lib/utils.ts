import type { Image, Task } from './types'
import { get, set, update } from 'idb-keyval'

export async function getHash(image: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(image)
  const buffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function getBase64(image: Blob): Promise<string> {
  const reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(image)
  })
}

export async function getStaredImages(): Promise<Image[]> {
  const images = await get<Image[]>('staredImages')
  if (images) {
    images.reverse()
    return images
  } else {
    await set('staredImages', [])
    return []
  }
}

export async function addStaredImage(image: Image): Promise<void> {
  await update('staredImages', (images: Image[] | undefined) => [
    ...(images ?? []),
    { ...image, star: true },
  ])
}

export async function deleteStaredImage(image: Image): Promise<void> {
  await update('staredImages', (images: Image[] | undefined) =>
    (images ?? []).filter((i) => i.hash !== image.hash),
  )
}

export function getPromptLanguage(): Task['promptLanguage'] {
  const local = localStorage.getItem('promptLanguage')
  return local === 'zh' ? 'zh' : 'en'
}

export function setPromptLanguage(
  promptLanguage: Task['promptLanguage'],
): void {
  localStorage.setItem('promptLanguage', promptLanguage)
}

export function getMaxGenerating(): number {
  const local = localStorage.getItem('maxGenerating')
  return local ? Number(local) : 1
}

export function setMaxGenerating(maxGenerating: number): void {
  localStorage.setItem('maxGenerating', String(maxGenerating))
}
