'use client'

import { Segmented, InputNumber, Input } from 'antd'
import {
  getPromptLanguage,
  setPromptLanguage,
  getMaxGenerating,
  setMaxGenerating,
  getPassword,
  setPassword,
} from '../lib/utils'

export default function Config() {
  return (
    <section className='w-full h-full overflow-hidden relative'>
      <div className='w-full h-full flex flex-col justify-center items-center gap-4'>
        <div className='w-full flex justify-center items-center gap-2 max-w-xl'>
          <div className='text-sm'>Prompt Language</div>
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
          <div className='text-sm'>Max Running Tasks</div>
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
        <div className='w-full flex justify-center items-center gap-2'>
          <div className='text-sm'>Server Password</div>
          <div className='w-40'>
            <Input.Password
              defaultValue={getPassword()}
              onChange={(e) => {
                return typeof e.target.value === 'string' &&
                  setPassword(e.target.value)
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
