// 定义常量
const SERVER = 'https://painter.leafyee.xyz'
const INTRO = '欢迎使用小叶子的AI绘画小程序<br>请在下方输入英文描述并点击生成按钮<br>支持自然语言和StableDiffusion提示词'
const MODELS = [
  '@cf/lykon/dreamshaper-8-lcm',
  '@cf/stabilityai/stable-diffusion-xl-base-1.0',
  '@cf/bytedance/stable-diffusion-xl-lightning',
]

// 初始化 swiper
import Swiper from 'swiper/bundle'
import 'swiper/css/bundle'
const swiper = new Swiper('.imgContainer', {
  effect: "cards",
  grabCursor: true,
})

/**
 * @class 页面元素及其方法
 * @property {HTMLElement} submit - 提交按钮
 * @method disableSubmit - 禁用提交按钮
 * @method enableSubmit - 启用提交按钮
 * @property {HTMLElement} select - 模型选择
 * @property {HTMLElement} textarea - 输入框
 * @property {HTMLElement} imgContainer - 图片容器 (swiper-wrapper)
 * @property {HTMLElement} dialog - 弹窗
 * @property {HTMLElement} dialogButton - 弹窗内的关闭按钮
 */
class Elements {
  static submit = document.querySelector('#submit')
  static disableSubmit() {
    this.submit.disabled = true
    this.submit.textContent = '生成中...'
  }
  static enableSubmit() {
    this.submit.disabled = false
    this.submit.textContent = '生成'
  }
  static select = document.querySelector('#model')
  static textarea = document.querySelector('#prompt')
  static imgContainer = document.querySelector('.swiper-wrapper')
  static dialog = document.querySelector('dialog')
  static dialogButton = document.querySelector('.noticeButton')
}

/**
 * @class 加载图片相关
 * @method insert - 插入加载图片 (如果不存在)
 * @method remove - 删除加载图片 (如果存在)
 */
class Loading {
  /** 创建加载图片元素 <div><img></div> */
  constructor() {
    const img = document.createElement('img')
    img.src = '/loading.gif'
    img.className = 'loading-img'
    this.ele = document.createElement('div').appendChild(img)
    this.ele.className = 'loading-con swiper-slide'
  }
  /** 插入加载图片 (如果不存在) */
  static insert() {
    const ele = document.querySelector('.loading-con') || null
    const loading = new Loading()
    ele || Elements.imgContainer.prepend(loading.ele)
    swiper.update()
  }
  /** 删除加载图片 (如果存在) */
  static remove() {
    const loading = document.querySelector('.loading-con') || null
    loading && loading.remove()
    swiper.update()
  }
}

/** 
 * @class 页面事件和初始化数据相关
 * @property {boolean} #retry - 记录是否重试
 * @method submitHandler - 提交事件处理函数
 * @method closeDialogHandler - 关闭弹窗事件处理函数
 * @method generateImage - 生成图片
 * @method init - 初始化页面
 */
class Page {
  /** 记录是否重试 */
  static #retry = false
  /** 提交事件处理函数 */
  static submitHandler(e) {
    // 阻止默认事件
    e.preventDefault()
    // 重置重试标志
    this.#retry = false
    // 生成图片
    Page.generateImage()
  }
  /** 关闭弹窗事件处理函数 */
  static closeDialogHandler() {
    // 关闭弹窗
    Elements.dialog.close()
    // 清除弹窗内容
    Elements.dialog.style.setProperty('--errorContent', '')
  }
  /** 生成图片 */
  static async generateImage() {
    try {

      // 禁用按钮
      Elements.disableSubmit()

      // 获取输入的文本
      const text = Elements.textarea.value
      // 如果没有输入文本，不发送请求
      if (!text) throw '请输入文本'
      // 获取模型
      const model = Elements.select.value
  
      // 插入加载图片
      Loading.insert()
  
      // 编码为 URL
      const encodedText = encodeURI(text)
      const encodedModel = encodeURI(model)
      // 发送请求
      const res = await fetch(`${SERVER}/?prompt=${encodedText}&model=${encodedModel}`)
      // 响应头为 'content-type': 'image/png'
      const blob = await res.blob()
  
      // 移除加载图片
      Loading.remove()
  
      // 创建图片对象的 URL
      const imgUrl = URL.createObjectURL(blob)
      // 创建一个图片元素
      const img = document.createElement('img')
      // 设置图片的 src
      img.src = imgUrl
      // 设置图片的 类名
      img.className = 'swiper-slide'
      // 添加到 imgContainer（插入到开头）
      Elements.imgContainer.prepend(img)
      // 更新 swiper
      swiper.update()

      // 恢复按钮
      Elements.enableSubmit()

    } catch (err) {

      if (this.#retry) {
        // 设置弹窗内容
        Elements.dialog.style.setProperty('--errorContent', `"${err.message || err}"`)
        // 移除加载图片
        Loading.remove()
        // 打开弹窗
        Elements.dialog.show()
        // 恢复按钮
        Elements.enableSubmit()
      } else {
        this.#retry = true
        // 重新生成图片
        Page.generateImage()
      }

    }
  }
  /** 初始化页面 */
  static init() {
    // 初始化模型选择
    MODELS.forEach(model => {
      const option = document.createElement('option')
      option.value = model
      option.innerHTML = `⊕&nbsp;&nbsp;${model}`
      Elements.select.appendChild(option)
    })
    // 设置指导语
    document.querySelector('#introduction').innerHTML = INTRO
    // 侦听提交按钮点击事件
    Elements.submit.addEventListener('click', e => Page.submitHandler(e))
    // 侦听关闭弹窗按钮点击事件
    Elements.dialogButton.addEventListener('click', e => Page.closeDialogHandler(e))
  }
}

// 初始化页面
Page.init()
