// 样式
import '../styles/App.css'
import '../styles/Widgets.css'
// 组件
import Images from './Images.tsx'
import Prompt from './Prompt.tsx'
import Dialog from './Dialog.tsx'
import LangSwitcher from './Widgets/LangSwitcher.tsx'
import ModeSwitcher from './Widgets/ModeSwitcher.tsx'
import ImageSelector from './Widgets/ImageSelector.tsx'
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
const initialImages: Image[] = (await get('staredImages')) ?? []
if (!initialImages) await set('staredImages', [])

// 主组件
export function App() {
  /**
   * idb-keyval 数据库中的数据
   * @var {Image[]} staredImages 已收藏图片列表
   * @var {Blob} loadingImage 加载图片
   */
  // 图片列表
  const [currentImages, setCurrentImages] = useState<Image[]>(initialImages.reverse())
  // 加载图片
  const [loadingImage, setLoadingImage] = useState<React.JSX.Element | null>(null)
  // useDialog
  const { dialogState, dialogAction, dialogRef } = useDialog()
  // 中文提示词模式
  const [langMode, setLangMode] = useState<'zh' | 'en'>('en')
  // 文生图/图生图模式
  const [geneMode, setGeneMode] = useState<'textToImage' | 'imageToImage'>('textToImage')
  // 是否有正在进行的操作
  const status = useRef('')
  // 图片选择器
  const imageSelectorRef = useRef<HTMLInputElement>(null)
  // 初始化操作
  useEffect(() => {
    // 视情况弹出更新提示
    versionInfo && dialogAction(versionInfo)
    // 根据用户设备暗色模式偏好设置主题
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) document.body.classList.add('dark')
  }, [dialogAction])

  return (
    <main className="container">

      <Images 
        currentImages={currentImages}
        setCurrentImages={setCurrentImages}
        dialogAction={dialogAction}
        langMode={langMode} 
        status={status}
        loadingImage={loadingImage}
      />

      <Prompt 
        currentImages={currentImages}
        setCurrentImages={setCurrentImages}
        dialogAction={dialogAction}
        langMode={langMode}
        status={status}
        geneMode={geneMode}
        fileRef={imageSelectorRef}
        setLoadingImage={setLoadingImage}
      >
        <div className="widgets">
          <LangSwitcher 
            setLangMode={setLangMode}
          />
          <ModeSwitcher 
            setGeneMode={setGeneMode}
          />   
          <ImageSelector 
            ref={imageSelectorRef}
            geneMode={geneMode}
          />
        </div>
      </Prompt>

      <Dialog 
        ref={dialogRef}
        dialogState={dialogState} 
        dialogAction={dialogAction}
      />

    </main>
  )
}
