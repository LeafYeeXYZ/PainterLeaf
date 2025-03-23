'use client'

import Painting from './Painting'
import Prompt from './Prompt'
import { useState, useEffect } from 'react'
import { ConfigProvider, type ThemeConfig, message } from 'antd'
import { ANTD_THEME_DARK, ANTD_THEME_LIGHT } from '../lib/config'
import { getStaredImages } from '../lib/utils'
import { useZustand } from '../lib/useZustand'
import { handleTasks } from '../lib/tasks'

export default function App() {
  // 动态设置主题
  const [config, setConfig] = useState<ThemeConfig>(ANTD_THEME_LIGHT)
  useEffect(() => {
    const getTheme = () =>
      window.matchMedia('(prefers-color-scheme: dark)').matches
    const subTheme = () =>
      setConfig(getTheme() ? ANTD_THEME_DARK : ANTD_THEME_LIGHT)
    setConfig(getTheme() ? ANTD_THEME_DARK : ANTD_THEME_LIGHT)
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', subTheme)
    return () =>
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', subTheme)
  }, [])
  // 初始化图片
  const tasks = useZustand((state) => state.tasks)
  const setTasks = useZustand((state) => state.setTasks)
  const setImages = useZustand((state) => state.setImages)
  const hasImage = useZustand((state) => state.hasImage)
  const setMessageApi = useZustand((state) => state.setMessageApi)
  useEffect(() => {
    getStaredImages().then((images) => setImages(() => images))
  }, [setImages])
  // 处理任务
  useEffect(() => {
    handleTasks(tasks, setTasks, setImages, hasImage)
  }, [tasks, setTasks, setImages, hasImage])
  // 消息提示
  const [messageApi, contextHolder] = message.useMessage()
  useEffect(() => {
    setMessageApi(messageApi)
  }, [messageApi, setMessageApi])

  return (
    <ConfigProvider theme={config}>
      <main className='w-full h-dvh mx-auto relative overflow-hidden grid grid-cols-1 grid-rows-[1fr_11.1rem] text-rose-950 dark:text-white'>
        <section className='w-full h-full overflow-hidden flex items-center justify-center bg-[#fff0f0] dark:bg-[#0e131d]'>
          <div className='w-full h-full overflow-hidden'>
            <Painting />
          </div>
        </section>
        <section className='w-full h-full overflow-hidden flex items-center justify-center bg-white dark:bg-gray-950'>
          <div className='w-full h-full overflow-hidden max-w-xl'>
            <Prompt />
          </div>
        </section>
      </main>
      {contextHolder}
    </ConfigProvider>
  )
}
