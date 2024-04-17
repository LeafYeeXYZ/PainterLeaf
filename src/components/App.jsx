// 样式
import '../styles/App.css'
import '../styles/Widgets.css'
// 组件
import Images from './Images.jsx'
import Prompt from './Prompt.jsx'
import Dialog from './Dialog.jsx'
import LangSwitcher from './Widgets/LangSwitcher.jsx'
// Hook
import { useState, useEffect } from 'react'
import useDialog from '../libs/useDialog.jsx'
// 其他
import check from '../libs/check.js'
import { get, set } from 'idb-keyval'

// 如果存在非目标版本数据，确认后清空 idb-keyval <- clearDB.js
const versionInfo = await check(2024041710)
// 获取已收藏图片列表
// 如果不存在已收藏图片列表，则初始化
const staredImages = await get('staredImages')
let initialImages = []
if (!staredImages) {
  await set('staredImages', [])
} else {
  staredImages.reverse()
  initialImages = staredImages
}

// 主组件
function App() {
  /**
   * 已收藏图片列表
   * @var {staredImages of idb-keyval}
   * @type {Array<{
   *  base64: string,
   *  type: 'image',
   *  star: true,
   *  hash: string,
   *  prompt: string,
   * }[]>}
   */
  /**
   * 加载图片  
   * 通过 getLoadingImage 获取为 images[0]
   * @var {loadingImage of idb-keyval}
   * @type {Blob}
   */
  /**
   * 声明一个状态变量，用于保存图片的 URL 和类型
   * @type {Array<{
   *  base64: string,
   *  type: 'image' | 'loading',
   *  star: boolean,
   *  hash: string,
   *  prompt: string,
   * }[]>}
   */
  const [images, setImages] = useState(initialImages)
  // 使用 useDialog 自定义 Hook
  const { dialogState, dialogAction, dialogRef } = useDialog()
  // 声明一个状态变量，用于记录中文提示词模式
  const [zhMode, setZhMode] = useState(false)
  useEffect(() => {
    // 视情况弹出更新提示
    versionInfo && dialogAction(versionInfo)
    // 根据用户设备暗色模式偏好设置主题
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.body.classList.add('dark')
    }
  }, [dialogAction])

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
