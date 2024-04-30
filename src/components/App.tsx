// 样式
import '../styles/App.css'
import '../styles/Widgets.css'
// 组件
import Images from './Images.tsx'
import Prompt from './Prompt.tsx'
import Dialog from './Dialog.tsx'
import LangSwitcher from './Widgets/LangSwitcher.tsx'
// Hook
import { useState, useEffect, useRef } from 'react'
import { useDialog } from '../libs/useDialog.tsx'
// 其他
import check from '../libs/check.ts'
import { get, set } from 'idb-keyval'
// 类型
export type Image = {
  base64: string
  type: 'image' | 'loading'
  star: boolean
  hash: string
  prompt: string
}

// 如果存在非目标版本数据，确认后清空 idb-keyval <- clearDB.js
const versionInfo = await check('2024041710')
// 获取已收藏图片列表
const staredImages: Image[] | undefined = await get('staredImages')
let initialImages: Image[] = []
if (!staredImages) {
  await set('staredImages', [])
} else {
  staredImages.reverse()
  initialImages = staredImages
}

// 主组件
export function App() {
  /**
   * idb-keyval 数据库中的数据
   * @var {Image[]} staredImages 已收藏图片列表
   * @var {Blob} loadingImage 加载图片
   */
  // 图片列表
  const [images, setImages] = useState(initialImages)
  // 使用 useDialog 自定义 Hook
  const { dialogState, dialogAction, dialogRef } = useDialog()
  // 声明一个状态变量，用于记录中文提示词模式
  const [zhMode, setZhMode] = useState(false)
  // 声明一个 ref, 用于记录是否有正在进行的操作
  const status = useRef('')
  // 初始化操作
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
        dialogAction={dialogAction}
        zhMode={zhMode} 
        status={status}
      />

      <Prompt 
        images={images}
        setImages={setImages} 
        dialogAction={dialogAction}
        zhMode={zhMode}
        status={status}
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
