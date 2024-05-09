import '../styles/Prompt.css'
import { useRef } from 'react'
import { SERVER } from '../config.json'
import getHash from '../libs/getHash.ts'
import getLoadingImage from '../libs/getLoadingImage.ts'
import { cloneDeep } from 'lodash-es'
import { blobToBase64 } from '../libs/base64_blob.ts'
import { DialogAction } from '../libs/useDialog.tsx'
import { Image } from './App.tsx'

// 获取模型列表
type Models = {
  [key: string]: { 
    description: string, 
    type: 'textToImage' | 'imageToImage' | 'both' 
    lang: '自然语言' | 'SD提示词'
  }
}
const desc = new Map([
  ['textToImage', '文生图'],
  ['imageToImage', '图生图'],
  ['both', '文生图/图生图'],
])
const data = await fetch(`${SERVER}/painter/models`).catch(() => null)
const models: Models = (data && await data.json().catch(() => null)) || {}
// 生成模型选项
const options: JSX.Element[] = []
for (const model in models) {
  options.push(<option value={model} key={model} data-type={models[model].type}>{models[model].description} {`(${models[model].lang}/${desc.get(models[model].type)})`}</option>)
}
// 获取加载图片
const loadingImage = await getLoadingImage()

interface PromptProps {
  images: Image[]
  setImages: (images: Image[]) => void
  dialogAction: React.Dispatch<DialogAction>
  zhMode: boolean
  status: React.MutableRefObject<string>
  children: JSX.Element
  mode: 'textToImage' | 'imageToImage'
  fileRef: React.RefObject<HTMLInputElement>
}

class ErrorInfo {
  title: string
  message: string
  deleteLoading: boolean
  self: boolean

  constructor(title: string, message: string, deleteLoading: boolean) {
    this.title = title
    this.message = message
    this.deleteLoading = deleteLoading
    this.self = true
  }
}

function Prompt({ children, images, setImages, dialogAction, zhMode, status, mode, fileRef }: PromptProps) {
  // 引用元素
  const submitRef = useRef<HTMLButtonElement>(null)
  const promptRef = useRef<HTMLTextAreaElement>(null)
  const modelRef = useRef<HTMLSelectElement>(null)
  // 点击生成按钮时的事件处理函数
  async function handleSubmit(event: React.MouseEvent, mode: 'textToImage' | 'imageToImage', prompt?: string) {
    event.preventDefault()
    if (status.current) {
      dialogAction({ type: 'open', title: '提示', content: `请等待${status.current}完成` })
      return
    } else {
      status.current = '生成图片'
    }
    try {
      // 禁用按钮
      submitRef.current!.disabled = true
      // 设置按钮文本
      submitRef.current!.textContent = '生成中...'
      // 获取用户输入的提示词
      const text = prompt || promptRef.current!.value
      // 如果用户没有输入提示词，不发送请求
      if (!text) throw new ErrorInfo('提示', '请输入提示词', false)
      // 如果是图生图模式，检查是否选择了图片
      if (mode === 'imageToImage') {
        if (!fileRef.current!.files || !fileRef.current!.files[0]) throw new ErrorInfo('提示', '当前为图生图模式, 请选择图片', false)
      }
      // 获取模型名称
      const model = modelRef.current!.value
      // 如果没有选择模型，不发送请求
      if (!model) throw new ErrorInfo('提示', '请选择模型', false)
      // 如果模型不支持当前模式，不发送请求
      if (models[model].type !== mode && models[model].type !== 'both') throw new ErrorInfo('提示', '当前模型不支持当前模式', false)

      // 插入加载图片
      const modifiedImages = cloneDeep(images)
      modifiedImages.unshift(loadingImage)
      setImages(modifiedImages)
      // 发送请求
      let res: Response
      if (mode === 'imageToImage') {
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
      const blob = await res.blob()
      // 根据图片大小判断是否为错误信息
      if (blob.size < 1024) throw new ErrorInfo('生成失败', '服务端返回空白图片, 可能是服务器错误或提示词不当', true)
      // 获取图片 Hash
      const hash = await getHash(blob)
      // 如果 hash 重复, 不添加图片
      if (images.some(image => image.hash === hash)) throw new ErrorInfo('生成失败', '服务端返回相同的图片, 请修改提示词或换一个模型', true)
      // 转换为 base64
      const base64 = await blobToBase64(blob)
      // 移除加载图片, 并更新图片列表
      const currentImages = cloneDeep(images)
      const updatedImages = currentImages.filter(image => image.type !== 'loading')
      updatedImages.unshift({ base64, type: 'image', star: false, hash, prompt: `${text} (${models[model].description})` })
      setImages(updatedImages)
    } catch (error) {
      // 移除加载图片, 打开对话框
      if (error instanceof ErrorInfo) {
        if (error.deleteLoading) {
          const currentImages = cloneDeep(images)
          const modifiedImages = currentImages.filter(image => image.type !== 'loading')
          setImages(modifiedImages)
        }
        dialogAction({ type: 'open', title: error.title, content: error.message })
      } else if (error instanceof Error) {
        dialogAction({ type: 'open', title: '生成失败', content: `Prompt -> handleSubmit -> ${error.name}: ${error.message}` })
      }
    } finally {
      // 启用按钮
      submitRef.current!.disabled = false
      // 设置按钮文本
      submitRef.current!.textContent = '生成'
      // 重置状态
      status.current = ''
    }
  }

  // 中文模式的事件处理函数
  async function handleSubmitZH(event: React.MouseEvent, mode: 'textToImage' | 'imageToImage') {
    event.preventDefault()
    if (status.current) {
      dialogAction({ type: 'open', title: '提示', content: `请等待${status.current}完成` })
      return
    } else {
      status.current = '翻译提示词'
    }
    // 禁用按钮
    submitRef.current!.disabled = true
    // 设置按钮文本
    submitRef.current!.textContent = '翻译中...'
    // 获取用户输入的提示词
    const textZH = promptRef.current!.value
    // 如果没有输入提示词，不发送请求
    if (!textZH) {
      // 打开对话框
      dialogAction({ type: 'open', title: '生成失败', content: '请输入提示词' })
      // 启用按钮
      submitRef.current!.disabled = false
      // 设置按钮文本
      submitRef.current!.textContent = '生成'
      // 退出
      return
    }
    // 翻译文本
    let textEN = ''
    try {
      const res = await fetch(`${SERVER}/painter/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textZH,
          source_lang: 'zh',
          target_lang: 'en',
        }),
      })
      const data = await res.json()
      textEN = data.result.translated_text
    } catch (error) {
      if (!(error instanceof Error)) throw new Error('未知错误: Prompt -> handleSubmitZH')
      // 打开对话框
      dialogAction({ type: 'open', title: '翻译失败', content: `${error.name}: ${error.message} (请尝试使用英文模式)` })
      // 启用按钮
      submitRef.current!.disabled = false
      // 设置按钮文本
      submitRef.current!.textContent = '生成'
      // 退出
      return
    } finally {
      // 重置状态
      status.current = ''
    }
    // 调用英文模式的事件处理函数
    handleSubmit(event, mode, textEN)
  }

  return (
    <form action="#" className='prompt-container'>

      {children}

      <textarea
        name="prompt" 
        cols={30}
        rows={10} 
        placeholder="请描述你想生成的图像"
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
        onClick={zhMode ? (event) => handleSubmitZH(event, mode) : (event) => handleSubmit(event, mode)}
      >生成</button>

    </form>
  )
}

export default Prompt