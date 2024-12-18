'use client'

import { Segmented, InputNumber } from 'antd'
import { getPromptLanguage, setPromptLanguage, getMaxGenerating, setMaxGenerating } from '../lib/utils'

export default function Config() {

  return (
    <section className='w-full h-full overflow-hidden relative'>
      <div className='w-full h-full flex flex-col justify-center items-center gap-4'>
        <div className='w-full flex justify-center items-center gap-2 max-w-xl'>
          <p className='text-sm'>Prompt Language</p>
          <Segmented
            className='border dark:border-[#424242]'
            options={[
              { value: 'en', label: 'English' },
              { value: 'zh', label: '中文' },
            ]}
            onChange={(value) => {
              setPromptLanguage(value as 'en' | 'zh')
            }}
            defaultValue={getPromptLanguage()}
          />
        </div>
        <div className='w-full flex justify-center items-center gap-2'>
          <p className='text-sm'>Max Running Tasks</p>
          <InputNumber
            min={1}
            max={3}
            step={1}
            defaultValue={getMaxGenerating()}
            onChange={(value) => {
              return typeof value === 'number' && setMaxGenerating(value)
            }}
          />
        </div>
      </div>
    </section>
  )
}
