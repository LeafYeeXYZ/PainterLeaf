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
    setConfig(getTheme() ? ANTD_THEME_DARK : ANTD_THEME_LIGHT)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', subTheme)
    return () => window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', subTheme)
  }, [])
  // 初始化图片
  const { tasks, setTasks, setImages, hasImage } = useZustand()
  useEffect(() => {
    getStaredImages().then((images) => setImages(() => images))
  }, [setImages])
  // 处理任务
  useEffect(() => {
    handleTasks(tasks, setTasks, setImages, hasImage)
  }, [tasks, setTasks, setImages, hasImage])

  return (
    <ConfigProvider theme={config}>
      <main className='w-full h-dvh mx-auto relative overflow-hidden grid grid-cols-1 grid-rows-[1fr,11.1rem] text-rose-950 dark:text-white'>
        <section className='w-full h-full overflow-hidden flex items-center justify-center bg-rose-50'>
          <div className='w-full h-full overflow-hidden max-w-xl'>
            <Painting />
          </div>
        </section>
        <section className='w-full h-full overflow-hidden flex items-center justify-center bg-white'>
          <div className='w-full h-full overflow-hidden max-w-xl'>
            <Prompt />
          </div>
        </section>
      </main>
    </ConfigProvider>
  )
}
