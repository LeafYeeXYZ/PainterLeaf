'use client'

import Painting from './Painting'
import Prompt from './Prompt'
import { useState, useEffect } from 'react'
import { ConfigProvider, type ThemeConfig } from 'antd'
import { ANTD_THEME_DARK, ANTD_THEME_LIGHT } from '../lib/config'
import { getStaredImages } from '../lib/utils'
import { useZustand } from '../lib/useZustand'
import { handleTasks } from '../lib/tasks'

export default function App() {

  // 动态设置主题
  const [config, setConfig] = useState<ThemeConfig>(ANTD_THEME_LIGHT)
  useEffect(() => {  
    const getTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches
    const subTheme = () => setConfig(getTheme() ? ANTD_THEME_DARK : ANTD_THEME_LIGHT)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', subTheme)
    return () => window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', subTheme)
  }, [])
  // 初始化图片
  const { tasks, setTasks, images, setImages, hasImage } = useZustand()
  useEffect(() => {
    getStaredImages().then((images) => setImages(() => images))
  }, [setImages])
  // 处理任务
  useEffect(() => {
    handleTasks(tasks, setTasks, images, setImages, hasImage)
  }, [tasks, setTasks, images, setImages, hasImage])

  return (
    <ConfigProvider theme={config}>
      <main className='w-full h-dvh max-w-xl mx-auto relative overflow-hidden grid grid-cols-1 grid-rows-[1fr,11.1rem]'>
        <section className='w-full h-full overflow-hidden'>
          <Painting />
        </section>
        <section className='w-full h-full overflow-hidden'>
          <Prompt />
        </section>
      </main>
    </ConfigProvider>
  )
}
