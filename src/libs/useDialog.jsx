import { useReducer } from 'react'

/**
 * 定义 reducer 函数
 * @param {Object} state 状态对象
 * @param {Object} state.title 记录对话框标题
 * @param {Object} state.content 记录对话框内容
 * @param {Object} state.ele 记录对话框元素的引用
 * @param {Object} action 动作对象
 * @param {'open' | 'close'} action.type 动作类型
 * @param {string} action.title 要设置的对话框标题
 * @param {string} action.content 要设置的对话框内容
 * @returns {Object} 返回新的状态对象
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
      throw new Error(`Unsupported action type: ${action.type}`)
    }
  }
}

/**
 * 接受一个对话框的引用
 * 返回该对话框的状态和操作函数
 * @param {useRef} dialogRef 对话框的引用
 * @typedef {Object} dialogState 对话框的状态
 * @property {string} dialogState.title 对话框的标题
 * @property {string} dialogState.content 对话框的内容
 * @property {useRef} dialogState.ele 对话框的引用
 * @typedef {Function} dialogAction 对话框的操作函数
 * @property {'open' | 'close'} dialogAction.type 打开或关闭对话框
 * @property {string} dialogAction.title 对话框的标题
 * @property {string} dialogAction.content 对话框的内容
 * @returns {Object} 返回对话框的状态和操作函数
 */
export default function useDialog(dialogRef) {
  // 使用 useReducer
  const [dialogState, dialogAction] = useReducer(reducer, { title: '', content: '', ele: dialogRef })
  // 返回操作函数
  return { dialogState, dialogAction }
}

