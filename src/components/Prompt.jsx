import '../styles/Prompt.css'
import PropTypes from 'prop-types'
import { useRef } from 'react'
import { SERVER } from '../config.json'
import getHash from '../libs/getHash'
import getLoadingImage from '../libs/getLoadingImage'
import { cloneDeep } from 'lodash-es'
import { blobToBase64 } from '../libs/base64_blob.js'

// 获取模型列表
const data = await fetch(`${SERVER}/painter/models`).catch(() => null)
const models = (data && await data.json().catch(() => null)) || {}
// 生成模型选项
const options = []
for (const model in models) {
  options.push(<option value={model} key={model}>{models[model]}</option>)
}
// 获取加载图片
const loadingImage = await getLoadingImage()

function Prompt({ children, images, setImages, dialogAction, zhMode, status }) {
  // 引用元素
  const submitRef = useRef(null)
  const promptRef = useRef(null)
  const modelRef = useRef(null)
  // 点击生成按钮时的事件处理函数
  async function handleSubmit(event, prompt) {
    event.preventDefault()
    if (status.current) {
      dialogAction({ type: 'open', title: '提示', content: `请等待${status.current}完成` })
      return
    } else {
      status.current = '生成图片'
    }
    try {
      // 禁用按钮
      submitRef.current.disabled = true
      // 设置按钮文本
      submitRef.current.textContent = '生成中...'
      // 获取用户输入的提示词
      const text = prompt || promptRef.current.value
      // 如果用户没有输入提示词，不发送请求
      if (!text) throw { title: '提示', message: '请输入提示词', deleteLoading: false, self: true }
      // 获取模型名称
      const model = modelRef.current.value
      // 如果没有选择模型，不发送请求
      if (!model) throw { title: '提示', message: '请选择模型', deleteLoading: false, self: true }
      // 插入加载图片
      const modifiedImages = cloneDeep(images)
      modifiedImages.unshift(loadingImage)
      setImages(modifiedImages)
      // 编码为 URL
      const encodedText = encodeURI(text)
      const encodedModel = encodeURI(model)
      // 发送请求
      const res = await fetch(`${SERVER}/painter/generate?prompt=${encodedText}&model=${encodedModel}`)
      // 解析响应体
      const blob = await res.blob()
      // 根据图片大小判断是否为错误信息
      if (blob.size < 1024) throw { title: '生成失败', message: '服务端返回空白图片, 可能是服务器错误或提示词不当', deleteLoading: true, self: true }
      // 获取图片 Hash
      const hash = await getHash(blob)
      // 转换为 base64
      const base64 = await blobToBase64(blob)
      // 移除加载图片, 并更新图片列表
      const currentImages = cloneDeep(images)
      const updatedImages = currentImages.filter(image => image.type !== 'loading')
      updatedImages.unshift({ base64, type: 'image', star: false, hash, prompt: `${text} (${models[model]})` })
      setImages(updatedImages)
    } catch (error) {
      // 移除加载图片, 打开对话框
      if (typeof error === 'object' && error.self) {
        if (error.deleteLoading) {
          const currentImages = cloneDeep(images)
          const modifiedImages = currentImages.filter(image => image.type !== 'loading')
          setImages(modifiedImages)
        }
        dialogAction({ type: 'open', title: '生成失败', content: error.message })
      } else {
        dialogAction({ type: 'open', title: '生成失败', content: `Prompt -> handleSubmit -> ${error}` })
      }      
    } finally {
      // 启用按钮
      submitRef.current.disabled = false
      // 设置按钮文本
      submitRef.current.textContent = '生成'
      // 重置状态
      status.current = ''
    }
  }
  // 中文模式的事件处理函数
  async function handleSubmitZH(event) {
    event.preventDefault()
    if (status.current) {
      dialogAction({ type: 'open', title: '提示', content: `请等待${status.current}完成` })
      return
    } else {
      status.current = '翻译提示词'
    }
    // 禁用按钮
    submitRef.current.disabled = true
    // 设置按钮文本
    submitRef.current.textContent = '翻译中...'
    // 获取用户输入的提示词
    const textZH = promptRef.current.value
    // 如果没有输入提示词，不发送请求
    if (!textZH) {
      // 打开对话框
      dialogAction({ type: 'open', title: '生成失败', content: '请输入提示词' })
      // 启用按钮
      submitRef.current.disabled = false
      // 设置按钮文本
      submitRef.current.textContent = '生成'
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
      // 打开对话框
      dialogAction({ type: 'open', title: '翻译失败', content: `${error} (请尝试使用英文模式)` })
      // 启用按钮
      submitRef.current.disabled = false
      // 设置按钮文本
      submitRef.current.textContent = '生成'
      // 退出
      return
    } finally {
      // 重置状态
      status.current = ''
    }
    // 调用英文模式的事件处理函数
    handleSubmit(event, textEN)
  }

  return (
    <form action="#" className='prompt-container'>

      {children}

      <textarea
        name="prompt" 
        cols="30" 
        rows="10" 
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
        onClick={zhMode ? handleSubmitZH : handleSubmit}
      >生成</button>

    </form>
  )
}

Prompt.propTypes = {
  images: PropTypes.array.isRequired,
  setImages: PropTypes.func.isRequired,
  dialogAction: PropTypes.func.isRequired,
  zhMode: PropTypes.bool.isRequired,
  status: PropTypes.object.isRequired,
  children: PropTypes.element,
}

export default Prompt