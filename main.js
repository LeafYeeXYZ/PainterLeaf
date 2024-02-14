// 获取元素
const textarea = document.querySelector('#prompt')
const submit = document.querySelector('#submit')
const imgContainer = document.querySelector('.image')
const dialog = document.querySelector('dialog')

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
    // 编码为 URL
    const encodedText = encodeURI(text)
    // 发送请求
    const res = await fetch(`https://painter.leafyee.xyz/?prompt=${encodedText}`)
    // 响应头为 'content-type': 'image/png'
    const blob = await res.blob()
    // 创建一个 URL 对象
    const imgUrl = URL.createObjectURL(blob)
    // 创建一个图片元素
    const img = document.createElement('img')
    // 设置图片的 src
    img.src = imgUrl
    // 如果 imgContainer 有内容，删除
    imgContainer.children.length && imgContainer.removeChild(imgContainer.children[0])
    // 添加到 imgContainer
    imgContainer.appendChild(img)
    // 恢复按钮
    submit.disabled = false
    submit.textContent = '生成'
  } catch (err) {
    // 设置弹窗内容
    dialog.style.setProperty('--errorContent', `"${err.message || err}"`)
    // 打开弹窗
    dialog.show()
    // 恢复按钮
    submit.disabled = false
    submit.textContent = '生成'
  }
}

// 监听点击事件
submit.addEventListener('click', e => {
  e.preventDefault()
  generateImage()
})

// 关闭弹窗的函数
document.querySelector('.noticeButton').addEventListener('click', () => {
  // 关闭弹窗
  dialog.close()
  // 清除弹窗内容
  dialog.style.setProperty('--errorContent', '')
})







