import { create } from 'zustand'
import type { Task, Image } from './types'

export type SetAction<T> = (prev: T) => T

export type States = {
  tasks: Task[]
  images: Image[]
  setTasks: (action: SetAction<Task[]>) => void
  setImages: (action: SetAction<Image[]>) => void
  hasImage: (hash: string) => boolean
}

export const useZustand = create<States>()((set, get) => ({
  tasks: [],
  images: [],
  setTasks: (action) => set((state) => ({ tasks: action(state.tasks) })),
  setImages: (action) => set((state) => ({ images: action(state.images) })),
  hasImage: (hash) => {
    return get().images.some((image) => image.hash === hash)
  }
}))
