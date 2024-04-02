// 定义服务端地址
const server = 'https://painter.leafyee.xyz'
// 初始化 swiper
import Swiper from 'swiper/bundle'
import 'swiper/css/bundle'
const swiper = new Swiper('.imgContainer', {
  effect: "cards",
  grabCursor: true,
})
// 获取元素
const textarea = document.querySelector('#prompt')
const submit = document.querySelector('#submit')
const imgContainer = document.querySelector('.swiper-wrapper')
const dialog = document.querySelector('dialog')
const introduction = document.querySelector('#introduction')
// 设置指导语
introduction.innerHTML = '欢迎使用小叶子的AI绘画小程序<br>请在下方输入英文描述并点击生成按钮<br>支持自然语言和StableDiffusion提示词'

// 提交函数
async function generateImage() {
  try {
    // 禁用按钮
    submit.disabled = true
    submit.textContent = '生成中...'
    // 获取输入的文本
    const text = textarea.value
    // 如果没有输入文本，不发送请求
    if (!text) throw '请输入文本'

    // 插入加载图片
    Loading.insert()

    // 编码为 URL
    const encodedText = encodeURI(text)
    // 发送请求
    const res = await fetch(`${server}/?prompt=${encodedText}`)
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
    imgContainer.prepend(img)
    // 更新 swiper
    swiper.update()

    // 恢复按钮
    submit.disabled = false
    submit.textContent = '生成'
  } catch (err) {
    if (retry) {
      // 设置弹窗内容
      dialog.style.setProperty('--errorContent', `"${err.message || err}"`)
      // 移除加载图片
      Loading.remove()
      // 打开弹窗
      dialog.show()
      // 恢复按钮
      submit.disabled = false
      submit.textContent = '生成'
    } else {
      retry = true
      // 重新生成图片
      generateImage()
    }
  }
}

// 监听点击事件
// 图片生成按钮
let retry = false
submit.addEventListener('click', e => {
  e.preventDefault()
  retry = false
  generateImage()
})
// 关闭弹窗按钮
document.querySelector('.noticeButton').addEventListener('click', () => {
  // 关闭弹窗
  dialog.close()
  // 清除弹窗内容
  dialog.style.setProperty('--errorContent', '')
})

// 插入和删除加载图片
class Loading {
  // 创建加载图片元素 <div><img></div>
  constructor() {
    this.img = document.createElement('img')
    this.img.src = '/loading.gif'
    this.img.className = 'loading-img'
    this.ele = document.createElement('div').appendChild(this.img)
    this.ele.className = 'loading-con swiper-slide'
  }
  // 插入加载图片 (如果不存在)
  static insert() {
    const ele = document.querySelector('.loading-con') || null
    const loading = new Loading()
    ele || imgContainer.prepend(loading.ele)
    swiper.update()
  }
  // 删除加载图片 (如果存在)
  static remove() {
    const loading = document.querySelector('.loading-con') || null
    loading && loading.remove()
    swiper.update()
  }
}








