'use client'

import { Models, type Model } from '../lib/config'
import { Form, Button, Select, Input, Space, Upload, Tooltip } from 'antd'
import { FileImageOutlined, ReadOutlined, UnorderedListOutlined } from '@ant-design/icons'
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
  const [form] = Form.useForm<FormValues>()

  return (
    <section className='w-full h-full overflow-hidden relative p-4'>
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          model: Models[0].value
        }}
        onFinish={handleFinish}
        className='pt-2'
        disabled={disabled}
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
            autoSize={{ minRows: 3, maxRows: 3 }}
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
          <Tooltip title='Generate prompt from image'>
            <Upload
              showUploadList={false}
              accept='.jpg,.jpeg,.png'
              beforeUpload={async (file) => {
                const MAX_SIZE_MB = 2
                try {
                  flushSync(() => setDisabled(true))
                  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                    alert(`Image size should be less than ${MAX_SIZE_MB}MB`)
                    return false
                  }
                  const uint8array = new Uint8Array(await file.arrayBuffer())
                  const res = await fetch('/api/prompt', {
                    method: 'POST',
                    body: JSON.stringify({ image: Array.from(uint8array) })
                  })
                  if (!res.ok) {
                    alert('Failed to generate prompt')
                    return false
                  }
                  const data = await res.json()
                  const prompt = data.result.description as string
                  form.setFieldsValue({ prompt })
                  return false
                } finally {
                  setDisabled(false)
                }
              }}
            >
              <Button 
                disabled={disabled}
                loading={disabled}
              >
                <FileImageOutlined /> to <ReadOutlined />
              </Button>
            </Upload>
          </Tooltip>
          <Tooltip title='Add prompt and model to task list'>
            <Button 
              htmlType='submit' 
              icon={<UnorderedListOutlined />}
            >
              Generate
            </Button>
          </Tooltip>
        </Space.Compact>
      </Form>
    </section>
  )
}
