export type Image = {
  /** Whether the image is starred */
  star: boolean
  /** The image's hash */
  hash: string
  /** The image's base64 data */
  data: string
  /** The image's prompt */
  prompt: string
  /** The image's model label */
  model: string
}

export type Task = {
  /** The timestamp when the task is created */
  createTimestamp: number
  /** The task's prompt */
  prompt: string
  /** The task's model value */
  model: string
  /** The task's prompt language */
  promptLanguage: 'en' | 'zh'
  /** The task's status */
  status: 'waiting' | 'generating' | 'success' | 'error'
  /** The task's error message */
  error?: string
}
