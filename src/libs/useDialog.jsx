import { useReducer, useRef } from 'react'

/**
 * 定义 reducer 函数
 * @param {import('../types.ts').DialogState} state 对话框的状态
 * @param {import('../types.ts').DialogAction} action 操作类型
 * @returns {import('../types.ts').DialogState} 更新后的对话框状态
 */
function reducer(state, action) {
  switch (action.type) {
    case 'open': {
      state.ele.current.show()
      return { title: action.title, content: action.content, ele: state.ele }
    }
    case 'close': {
      state.ele.current.close()
      return { title: '', content: '', ele: state.ele }
    }
    default: {
      throw new TypeError(`Unsupported action type: ${action.type}`)
    }
  }
}

/**
 * 创建一个对话框的 Hook
 * @returns {{
 *   dialogState: import('../types.ts').DialogState,
 *   dialogAction: import('../types.ts').DialogAction,
 *   dialogRef: import('react').MutableRefObject<null>
 * }} 对话框的状态和操作
 */
export default function useDialog() {
  // 创建一个对话框的引用
  const dialogRef = useRef(null)
  // 使用 useReducer
  const [dialogState, dialogAction] = useReducer(reducer, { title: '', content: '', ele: dialogRef })
  // 返回操作函数
  return { dialogState, dialogAction, dialogRef }
}

