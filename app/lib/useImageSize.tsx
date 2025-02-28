import { useSyncExternalStore } from 'react'

export function useImageSize(containerID: string): number {
  const getSize = () => {
    const container = document.getElementById(containerID)
    return (
      Math.min(container?.clientWidth || 0, container?.clientHeight || 0) - 20
    )
  }
  const subSize = (callback: () => void) => {
    window.addEventListener('resize', callback)
    return () => window.removeEventListener('resize', callback)
  }
  return useSyncExternalStore(subSize, getSize, () => 0)
}
