import { useSyncExternalStore } from 'react'

export function useImageSize(containerID: string): number {
  const getSize = () => {
    const container = document.getElementById(containerID)
    return Math.min(container?.clientWidth || 0, container?.clientHeight || 0) - 48
  }
  const subSize = (callback: () => void) => {
    const container = document.getElementById(containerID)
    container?.addEventListener('resize', callback)
    return () => container?.removeEventListener('resize', callback)
  }
  return useSyncExternalStore(subSize, getSize, () => 0)
}
