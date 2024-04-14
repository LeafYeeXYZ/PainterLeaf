import '../styles/App.css'
import '../styles/Widgets.css'
import Images from './Images.jsx'
import Prompt from './Prompt.jsx'
import Dialog from './Dialog.jsx'
import LangSwitcher from './Widgets/LangSwitcher.jsx'
import localforage from 'localforage'
import { useState, useRef, useEffect } from 'react'
import { useImmer } from 'use-immer'
import useDialog from '../libs/useDialog.jsx'

function App() {
  /**
   * 声明一个状态变量，用于保存图片的 URL 和类型
   * @type {Array<{
   *  url: string,
   *  type: 'image' | 'loading',
   *  star: 'stared' | 'notStared',
   *  hash: string
   * }>}
   */
  const [images, setImages] = useImmer([])
  /** 一个引用，用于表示 dialog 元素 */
  const dialogRef = useRef(null)
  // 使用 useDialog 自定义 Hook
  const { dialogState, dialogAction } = useDialog(dialogRef)
  // 声明一个状态变量，用于记录中文提示词模式
  const [zhMode, setZhMode] = useState(false)
  // 首次渲染时从 localforage 中获取已收藏图片列表
  useEffect(() => {
    localforage.getItem('staredImages')
    .then(staredImages => { if (staredImages) {
      // 将已收藏图片列表转换为图片信息列表
      const initialImages = staredImages.map(image => {
        const url = URL.createObjectURL(image.blob)
        const hash = image.hash
        return { url, type: 'image', star: 'stared', hash }
      })
      // 倒转并设置图片信息列表
      initialImages.reverse()
      setImages(initialImages)
    }})
  }, [setImages])

  return (
    <main className="container">

      <Images 
        images={images} 
        setImages={setImages}
        zhMode={zhMode} 
        dialogAction={dialogAction}
      />

      <Prompt 
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
