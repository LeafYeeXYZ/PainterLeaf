import type { DialogAction } from '../../libs/useDialog'
import { SERVER } from '../../config.json'
import { useRef, useState, useContext } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { flushSync } from 'react-dom'
import { LangContext } from '../../lang'

interface PromptGeneratorProps {
  status: React.MutableRefObject<string>
  dialogAction: React.Dispatch<DialogAction>
  promptRef: React.RefObject<HTMLTextAreaElement>
}

export default function PromptGenerator({ status, dialogAction, promptRef }: PromptGeneratorProps) {

  const t = useContext(LangContext)

  const initText: React.JSX.Element = <span>{t.initText}</span>
  const loadText = <span>{t.loadText} <LoadingOutlined /></span>
  const textRef = useRef<HTMLParagraphElement>(null)
  const [text, setText] = useState<React.JSX.Element>(initText)
  const lebalRef = useRef<HTMLLabelElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return
    try {
      // 设置状态
      status.current = t.generatePrompt
      e.target.disabled = true
      lebalRef.current!.style.cursor = 'not-allowed'
      lebalRef.current!.style.filter = 'grayscale(0.9)'
      lebalRef.current!.style.opacity = '0.9'
      flushSync(() => setText(loadText))
      // 检测文件大小
      const file = e.target.files[0]
      if (file.size > 2 * 1024 * 1024) {
        dialogAction({
          type: 'open',
          title: t.imageTooBig,
          content: t.imageTooBigInfo(2),
        })
        return
      }
      // 读取文件
      const uint8array = new Uint8Array(await file.arrayBuffer())
      // 发送请求
      const res = await fetch(`${SERVER}/painter/genprompt`, {
        method: 'POST',
        body: JSON.stringify({
          image: Array.from(uint8array),
        }),
      })
      // 处理返回数据
      const data = await res.json()      
      if (!res.ok) throw new Error(JSON.stringify(data))
      const prompt = data.result.description as string
      // 设置提示词
      promptRef.current!.value = prompt
    } catch (error) {
      if (error instanceof Error) {
        dialogAction({
          type: 'open',
          title: t.error,
          content: `${t.genPromptFail} ${error.name} - ${error.message}`
        })
      }
    } finally {
      status.current = ''
      e.target.value = ''
      e.target.disabled = false
      lebalRef.current!.style.cursor = 'pointer'
      lebalRef.current!.style.filter = 'grayscale(0)'
      lebalRef.current!.style.opacity = '0.3'
      setText(initText)
    }
  }

  return (
    <label 
      className='prompt-generator-container'
      htmlFor='prompt-generator-input'
      ref={lebalRef}
      style={{ width: t.lang.includes('zh') ? '6.7rem' : '8.5rem' }}
    >
      <input
        type="file"
        accept='image/png, image/jpeg'
        name='prompt-generator-input'
        id='prompt-generator-input'
        style={{ opacity: 0, width: 0 }}
        onChange={handleFileChange}
      />
      <span
        className='prompt-generator-text'
        ref={textRef}
      >
        {text}
      </span>
    </label>
  )
}