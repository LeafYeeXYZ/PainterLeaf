import '../styles/Prompt.css'
import PropTypes from 'prop-types'
import { useRef } from 'react'
import { SERVER } from '../config.json'
import getHash from '../libs/getHash'
import getLoadingImage from '../libs/getLoadingImage'
import { cloneDeep } from 'lodash-es'

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

function Prompt({ children, images, setImages, dialogAction, zhMode }) {
  // 引用元素
  const submitRef = useRef(null)
  const promptRef = useRef(null)
  const modelRef = useRef(null)
  // 点击生成按钮时的事件处理函数
  async function handleSubmit(event, prompt) {
    event.preventDefault()
    // 禁用按钮
    submitRef.current.disabled = true
    // 设置按钮文本
    submitRef.current.textContent = '生成中...'
    // 获取用户输入的提示词
    const text = prompt || promptRef.current.value

    try {
      // 如果用户没有输入提示词，不发送请求
      if (!text) throw { message: '请输入提示词', deleteLoading: false }
      // 获取模型名称
      const model = modelRef.current.value
      // 如果没有选择模型，不发送请求
      if (!model) throw { message: '请选择模型', deleteLoading: false }
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
      if (blob.size < 1024) throw { message: '服务端返回空白图片, 可能是服务器错误或提示词不当', deleteLoading: true }
      // 获取图片 Hash
      const hash = await getHash(blob)
      // 移除加载图片, 并更新图片列表
      const updatedImages = cloneDeep(images)
      updatedImages.shift()
      updatedImages.unshift({ blob, type: 'image', star: false, hash, prompt: `${text} (${models[model]})` })
      setImages(updatedImages)
      // 启用按钮
      submitRef.current.disabled = false
      // 设置按钮文本
      submitRef.current.textContent = '生成'
    } 
    catch (error) {
      // 移除加载图片
      if (error.deleteLoading) {
        const modifiedImages = cloneDeep(images)
        modifiedImages.shift()
        setImages(modifiedImages)
      }
      // 打开对话框
      dialogAction({ type: 'open', title: '生成失败', content: error.message || error })
      // 启用按钮
      submitRef.current.disabled = false
      // 设置按钮文本
      submitRef.current.textContent = '生成'
    }    
  }
  // 中文模式的事件处理函数
  async function handleSubmitZH(event) {
    event.preventDefault()
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
    }
    catch (error) {
      // 打开对话框
      dialogAction({ type: 'open', title: '翻译失败', content: '请尝试使用英文模式' })
      // 启用按钮
      submitRef.current.disabled = false
      // 设置按钮文本
      submitRef.current.textContent = '生成'
      // 退出
      return
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
  children: PropTypes.element,
}

export default Prompt