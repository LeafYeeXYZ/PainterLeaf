// 引入 React
import { SERVER } from './config.json'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Switch, ConfigProvider } from 'antd'
import { Page, Loading, swiper, Elements } from './main.js' 
// 引入样式
import './react.css'
import 'swiper/css/bundle'
// 中文模式的回调函数
function callbackZh(e) {
  // 禁用按钮
  Elements.submit.disabled = true
  Elements.submit.textContent = '翻译中...'
  // 获取输入的文本
  const textZH = Elements.textarea.value
  // 如果没有输入文本，不发送请求
  if (!textZH) {
    Page.submitHandler(e, false)
    return
  }
  // 翻译文本
  fetch(`${SERVER}/painter/translate`, {
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
  .then(response => response.json())
  .then(data => {
    const textEN = data.result.translated_text
    console.log(textEN)
    Page.submitHandler(e, textEN)
  })
  .catch(_err => {
    // 设置弹窗内容
    Elements.dialog.style.setProperty('--errorContent', '"翻译失败，请尝试使用英文模式"')
    // 打开弹窗
    Elements.dialog.show()
    // 恢复按钮
    Elements.enableSubmit()
  })
}
// 页面初始化
Page.init()
// 创建虚拟 DOM
const root = createRoot(document.querySelector('#react'))
// 渲染组件
root.render(<App />)

// 根组件
function App() {
  return (
    <>
      <TranslateButton />
    </>
  )
}
// 按钮组件
function TranslateButton() {
  // 语言切换处理函数
  const handleChange = (checked) => {
    if (checked) {
      document.querySelector('#sour-lang').innerHTML = '英文'
      Elements.submit.removeEventListener('click', callbackZh)
      Elements.submit.addEventListener('click', Page.submitHandler)
    } else {
      document.querySelector('#sour-lang').innerHTML = '中文'
      Elements.submit.removeEventListener('click', Page.submitHandler)
      Elements.submit.addEventListener('click', callbackZh)
    }
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#F18F01', /* 亮色背景颜色 */
          colorPrimaryHover: '#D16F00', /* 亮色背景颜色 (hover) */
          colorTextQuaternary: '#D16F00', /* 暗色背景颜色 */
          colorTextTertiary: '#D16F00', /* 暗色背景颜色 (hover) */
        },
        components: {
          Switch: {
            handleBg: '#FFD700',
          },
        },
      }}
    >
      <Switch
        className='lang-switcher' 
        checkedChildren='英文提示词'
        unCheckedChildren='中文提示词'
        defaultChecked 
        onChange={handleChange}
      />
    </ConfigProvider>
  )
}