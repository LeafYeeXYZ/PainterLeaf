import '../styles/App.css'
import Images from './Images.jsx'
import Prompt from './Prompt.jsx'
import Dialog from './Dialog.jsx'
import LangSwitcher from './LangSwitcher.jsx'

import { useState, useRef } from 'react'
import useDialog from '../libs/useDialog.jsx'

function App() {
  // 声明一个状态变量，用于保存图片的 URL 和类型
  const [images, setImages] = useState([])
  // 声明一个引用，用于表示 dialog 元素
  const dialogRef = useRef(null)
  // 使用 useDialog 自定义 Hook
  const { dialogState, dialogAction } = useDialog(dialogRef)
  // 声明一个状态变量，用于记录中文提示词模式
  const [zhMode, setZhMode] = useState(false)

  return (
    <main className="container">

      <Images 
        images={images} 
        zhMode={zhMode}
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
