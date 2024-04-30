/** 对话框的状态 */
export type DialogState = {
  title: string
  content: string
  ele: React.MutableRefObject<null>
}
/** 对话框的操作 */
export type DialogAction = (action: {
  type: 'open' | 'close'
  title: string
  content: string
}) => void

/** 图片对象 */
export type Image = {
  base64: string
  type: 'image' | 'loading'
  star: boolean
  hash: string
  prompt: string
}

