// 样式
import '../styles/App.css'
import '../styles/Widgets.css'
// 组件
import Images from './Images.jsx'
import Prompt from './Prompt.jsx'
import Dialog from './Dialog.jsx'
import LangSwitcher from './Widgets/LangSwitcher.jsx'
// Hook
import { useState } from 'react'
import useDialog from '../libs/useDialog.jsx'
// 其他
import getStaredImages from '../libs/getStaredImages.js'
import clearDB from '../libs/clearDB.js'
import checkBrowser from '../libs/checkBrowser.js'

// 如果存在非目标版本数据，确认后清空 IndexedDB
const versionInfo = await clearDB(2024041522)
// 检测浏览器版本是否符合编译目标
checkBrowser()
// 获取已收藏图片列表
const staredImages = await getStaredImages()

// 主组件
function App() {
  /**
   * 声明一个状态变量，用于保存图片的 URL 和类型
   * @type {Array<{
   *  blob: Blob,
   *  type: 'image' | 'loading',
   *  star: 'stared' | 'notStared',
   *  hash: string,
   *  prompt: string,
   * }>}
   */
  const [images, setImages] = useState(staredImages)
  // 使用 useDialog 自定义 Hook
  const { dialogState, dialogAction, dialogRef } = useDialog()
  // 声明一个状态变量，用于记录中文提示词模式
  const [zhMode, setZhMode] = useState(false)
  // 视情况弹出更新提示
  versionInfo && dialogAction(versionInfo)

  return (
    <main className="container">

      <Images 
        images={images} 
        setImages={setImages}
        zhMode={zhMode} 
        dialogAction={dialogAction}
      />

      <Prompt 
        images={images}
        setImages={setImages} 
        dialogAction={dialogAction}
        zhMode={zhMode}
      >
        <LangSwitcher 
          setZhMode={setZhMode}
        />
      </Prompt>

      <Dialog 
        ref={dialogRef}
        dialogState={dialogState} 
        dialogAction={dialogAction}
      />

    </main>
  )
}

export default App
