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
/** useDialog 的返回值 */
export type UseDialog = {
  dialogState: DialogState
  dialogAction: DialogAction
  dialogRef: React.MutableRefObject<null>
}

