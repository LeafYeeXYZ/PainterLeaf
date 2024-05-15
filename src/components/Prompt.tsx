import '../styles/Prompt.css'
import { useRef, useState, useContext } from 'react'
import { LangContext } from '../lang.tsx'
import { SERVER } from '../config.json'
import getHash from '../libs/getHash.ts'
import getLoadingImage from '../libs/getLoadingImage.tsx'
import { blobToBase64 } from '../libs/base64_blob.ts'
import { DialogAction } from '../libs/useDialog.tsx'
import { Image } from './App.tsx'
import { flushSync } from 'react-dom'
import { LoadingOutlined } from '@ant-design/icons'

// 获取模型列表
type Models = {
  [key: string]: { 
    description: string, 
    type: 'textToImage' | 'imageToImage' | 'both' 
    lang: 'natural' | 'sdPrompt'
  }
}
const data = await fetch(`${SERVER}/painter/models`).catch(() => null)
const models: Models = (data && await data.json().catch(() => null)) || {}

// 获取加载图片
const loadingImage = await getLoadingImage()

interface PromptProps {
  currentImages: Image[]
  setCurrentImages: React.Dispatch<React.SetStateAction<Image[]>>
  dialogAction: React.Dispatch<DialogAction>
  langMode: 'zh' | 'en'
  status: React.MutableRefObject<string>
  children: JSX.Element
  geneMode: 'textToImage' | 'imageToImage'
  fileRef: React.RefObject<HTMLInputElement>
  setLoadingImage: React.Dispatch<React.SetStateAction<React.JSX.Element | null>>
  promptRef: React.RefObject<HTMLTextAreaElement>
}

class ErrorInfo {
  title: string
  message: string
  constructor(title: string, message: string) {
    this.title = title
    this.message = message
  }
}

function Prompt({ children, currentImages, setCurrentImages, dialogAction, langMode, status, geneMode, fileRef, setLoadingImage, promptRef }: PromptProps) {

  // 語言
  const t = useContext(LangContext)

  // 生成模型选项
  const options: JSX.Element[] = []
  for (const model in models) {
    options.push(<option value={model} key={model} data-type={models[model].type}>{models[model].description} {`(${t.modelLangs[models[model].lang]}/${t.modelTypes[models[model].type]})`}</option>)
  }

  // 引用元素
  const submitRef = useRef<HTMLButtonElement>(null)
  const modelRef = useRef<HTMLSelectElement>(null)
  // 按钮文本
  const initialContent = <span>{t.submitInit}</span>
  const loadingContent = <span>{t.submitLoad} <LoadingOutlined /></span>
  const [buttonContent, setButtonContent] = useState<React.JSX.Element>(initialContent)

  // 翻译函数
  async function translate(text: string): Promise<string> {
    try {
      const res = await fetch(`${SERVER}/painter/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          source_lang: 'zh',
          target_lang: 'en',
        }),
      })
      const data = await res.json()
      return data.result.translated_text as string
    } catch (error) {
      throw new ErrorInfo(t.translateFalseTitle, t.translateFalseMessage)
    }
  }

  // 点击生成按钮时的事件处理函数
  async function handleSubmit(event: React.MouseEvent, geneMode: 'textToImage' | 'imageToImage', langMode: 'zh' | 'en', images: Image[]) {
    event.preventDefault()
    if (status.current) {
      dialogAction({ type: 'open', title: t.info, content: t.wait.replace('${status.current}', status.current) })
      return
    } else {
      status.current = t.generate
    }
    try {
      // 禁用按钮
      submitRef.current!.disabled = true
      // 设置按钮文本
      flushSync(() => setButtonContent(loadingContent))
      // 获取用户输入的提示词
      let text = promptRef.current!.value
      // 如果用户没有输入提示词，不发送请求
      if (!text) throw new ErrorInfo(t.info, t.noPrompt)
      // 如果是图生图模式，检查是否选择了图片
      if (geneMode === 'imageToImage') {
        if (!fileRef.current!.files || !fileRef.current!.files[0]) throw new ErrorInfo(t.info, t.noImage)
      }
      // 获取模型名称
      const model = modelRef.current!.value
      // 如果没有选择模型，不发送请求
      if (!model) throw new ErrorInfo(t.info, t.noModel)
      // 如果模型不支持当前模式，不发送请求
      if (models[model].type !== geneMode && models[model].type !== 'both') throw new ErrorInfo(t.info, t.unsupportedModel)

      // 插入加载图片
      flushSync(() => setLoadingImage(loadingImage))

      // 如果是中文模式，先翻译提示词
      if (langMode === 'zh') { text = await translate(text) }

      // 发送请求
      let res: Response
      if (geneMode === 'imageToImage') {
        // 图片数组
        const data = Array.from(new Uint8Array(await fileRef.current!.files![0].arrayBuffer()))
        res = await fetch(`${SERVER}/painter/generate`, {
          method: 'POST',
          body: JSON.stringify({
            image: data,
            prompt: text,
            model: model,            
          }),
        })
      } else {
        res = await fetch(`${SERVER}/painter/generate`, {
          method: 'POST',
          body: JSON.stringify({
            prompt: text,
            model: model,
          }),
        })
      }
      // 解析响应体
      const contentType = res.headers.get('content-type') ?? ''
      // 判断是否为错误信息
      if (contentType.startsWith('application/json')) {
        const json = await res.json()
        throw new ErrorInfo(t.genFail, `${t.serverError} ${JSON.stringify(json)}; Model: ${model}`)
      }
      if (!contentType.startsWith('image')) {
        throw new ErrorInfo(t.genFail, `${t.unknownResStatusError} ${res.status} ${res.statusText}`)
      }
      // 获取图片 Blob
      const blob = await res.blob()
      if (blob.size < 1024) {
        throw new ErrorInfo(t.genFail, t.noImageError)
      }
      // 获取图片 Hash
      const hash = await getHash(blob)
      // 如果 hash 重复, 不添加图片
      if (images.some(image => image.hash === hash)) throw new ErrorInfo(t.genFail, t.sameImageError)
      // 转换为 base64
      const base64 = await blobToBase64(blob)
      // 更新图片列表
      setCurrentImages([ { base64, type: 'image', star: false, hash, prompt: `${text} (${models[model].description})` }, ...images ])
    } catch (error) {
      // 打开对话框
      if (error instanceof ErrorInfo) {
        dialogAction({ type: 'open', title: error.title, content: error.message })
      } else if (error instanceof Error) {
        dialogAction({ type: 'open', title: t.genFail, content: `Prompt -> handleSubmit -> ${error.name}: ${error.message}` })
      }
    } finally {
      // 启用按钮
      submitRef.current!.disabled = false
      setButtonContent(initialContent)
      // 移除加载图片
      setLoadingImage(null)
      // 重置状态
      status.current = ''
    }
  }

  return (
    <form action="#" className='prompt-container'>

      {children}

      <textarea
        name="prompt" 
        cols={30}
        rows={10} 
        placeholder={t.promptPlaceholder}
        className='prompt-textarea'
        ref={promptRef}
      ></textarea>

      <select
        name="model" 
        id="model"
        className='prompt-models'
        ref={modelRef}
      >
        {options}
      </select>

      <button 
        className='prompt-submit'
        ref={submitRef}
        onClick={event => handleSubmit(event, geneMode, langMode, currentImages)}
      >{buttonContent}</button>

    </form>
  )
}

export default Prompt