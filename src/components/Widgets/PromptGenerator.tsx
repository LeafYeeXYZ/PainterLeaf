import type { DialogAction } from '../../libs/useDialog'
import { SERVER } from '../../config.json'
import { useRef, useState } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { flushSync } from 'react-dom'

interface PromptGeneratorProps {
  status: React.MutableRefObject<string>
  dialogAction: React.Dispatch<DialogAction>
  promptRef: React.RefObject<HTMLTextAreaElement>
}

export default function PromptGenerator({ status, dialogAction, promptRef }: PromptGeneratorProps) {

  const initText: React.JSX.Element = <span>用图片生成提示词</span>
  const loadText = <span>生成提示词中 <LoadingOutlined /></span>
  const textRef = useRef<HTMLParagraphElement>(null)
  const [text, setText] = useState<React.JSX.Element>(initText)
  const lebalRef = useRef<HTMLLabelElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return
    try {
      // 设置状态
      status.current = '生成提示词'
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
          title: '图片过大',
          content: '请选择小于 2MB 的图片',
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
          title: '错误',
          content: `提示词生成失败：${error.name} - ${error.message}`
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