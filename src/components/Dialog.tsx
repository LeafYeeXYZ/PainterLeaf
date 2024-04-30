import '../styles/Dialog.css'
import { DialogState, DialogAction } from '../libs/useDialog.tsx'

function Dialog({ dialogState, dialogAction, ref}: { dialogState: DialogState, dialogAction: React.Dispatch<DialogAction>, ref: React.MutableRefObject<HTMLDialogElement | null> }) {
  // 关闭对话框
  function closeDialog() {
    dialogAction({ type: 'close', title: '', content: '' })
  }

  return (
    <dialog className='dialog-main' ref={ref}>
      <div className="dialog-container">
        <div className='dialog-sub'>
          <div className="dialog-title">{dialogState.title}</div>
          <div className="dialog-content">{dialogState.content}</div>
        </div>
        <button className="dialog-button" onClick={closeDialog}>
          确定
        </button>
      </div>
    </dialog>
  )
}

export default Dialog