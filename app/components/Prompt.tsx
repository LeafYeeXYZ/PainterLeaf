'use client'

import { Models, type Model } from '../lib/config'
import { Form, Button, Select, Input, Space } from 'antd'
import { useState } from 'react'
import { flushSync } from 'react-dom'
import type { Task } from '../lib/types'
import { getPromptLanguage } from '../lib/utils'
import { useZustand } from '../lib/useZustand'

type FormValues = {
  prompt: string
  model: Model['value']
}

export default function Prompt() {
  
  const { setTasks } = useZustand()
  const [disabled, setDisabled] = useState(false)
  const handleFinish = (value: FormValues) => {
    flushSync(() => setDisabled(true))
    const task = {
      prompt: value.prompt,
      model: value.model,
      promptLanguage: getPromptLanguage(),
      status: 'waiting' as Task['status'],
      createTimestamp: Date.now()
    }
    setTasks((prev) => [task, ...prev])
    setTimeout(() => setDisabled(false), 10)
  }

  return (
    <section className='w-full h-full overflow-hidden relative px-4'>
      <Form<FormValues>
        layout='vertical'
        initialValues={{
          model: Models[0].value
        }}
        onFinish={handleFinish}
        className='pt-2'
      >
        <Form.Item
          name='prompt'
          rules={[
            { required: true, message: 'Please input prompt' },
            () => ({
              validator(_, value) {
                if (!value) return Promise.resolve()
                const promptLanguage = getPromptLanguage()
                if (promptLanguage === 'en' && (value as string).match(/[\u4e00-\u9fa5]/)) {
                  return Promise.reject(new Error('Chinese characters are not allowed in English prompt'))
                } else if (promptLanguage === 'zh' && !(value as string).match(/[\u4e00-\u9fa5]/)) {
                  return Promise.reject(new Error('请输入中文提示词, 或在设置中切换至英文'))
                }
                return Promise.resolve()
              }
            })
          ]}
        >
          <Input.TextArea
            placeholder='Input Your Prompt Here'
            autoSize={{ minRows: 4, maxRows: 4 }}
          />
        </Form.Item>
        <Space.Compact block>
          <Form.Item
            noStyle
            name='model'
            rules={[{ required: true, message: 'Please select model!' }]}
          >
            <Select
              className='w-full'
              options={Models.map((model) => ({ value: model.value, label: model.label }))}
            />
          </Form.Item>
          <Button type='primary' htmlType='submit' block disabled={disabled}>
            Add Task
          </Button>
        </Space.Compact>
      </Form>
    </section>
  )
}