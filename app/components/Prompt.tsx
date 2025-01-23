'use client'

import { Models } from '../lib/config'
import { Form, Button, Select, Input, Space, Upload, Popover } from 'antd'
import { FileImageOutlined, FileAddOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { flushSync } from 'react-dom'
import type { Task } from '../lib/types'
import { getPromptLanguage } from '../lib/utils'
import { useZustand } from '../lib/useZustand'

type FormValues = {
  prompt: string
  model: string
}

export default function Prompt() {
  
  const { setTasks, messageApi } = useZustand()
  const [disabled, setDisabled] = useState(false)
  const handleFinish = (value: FormValues) => {
    flushSync(() => setDisabled(true))
    const model = Models.find((m) => m.value === value.model)!
    const task = {
      prompt: value.prompt,
      trigger: model.trigger,
      model: model.value,
      promptLanguage: getPromptLanguage(),
      status: 'waiting' as Task['status'],
      createTimestamp: Date.now()
    }
    setTasks((prev) => [task, ...prev])
    messageApi?.success('Added to tasks', 1)
    setTimeout(() => setDisabled(false), 10)
  }
  const [form] = Form.useForm<FormValues>()

  return (
    <section className='w-full h-full overflow-hidden relative p-4 flex items-center justify-center'>
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          model: Models[0].value
        }}
        onFinish={handleFinish}
        className='w-full'
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
              className='w-full text-ellipsis overflow-hidden text-nowrap'
              options={Models.map((model) => ({ value: model.value, label: model.label }))}
            />
          </Form.Item>
          <Popover
            title='Generate Prompt from Image'
            content={(<Upload
              showUploadList={false}
              accept='.jpg,.jpeg,.png'
              beforeUpload={async (file) => {
                const MAX_SIZE_MB = 5
                try {
                  messageApi?.open({
                    type: 'loading',
                    content: 'Generating prompt',
                    duration: 0,
                    key: 'generating-prompt'
                  })
                  flushSync(() => setDisabled(true))
                  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                    messageApi?.destroy('generating-prompt')
                    messageApi?.error(`Image size should be less than ${MAX_SIZE_MB} MB`)
                    return false
                  }
                  const uint8array = new Uint8Array(await file.arrayBuffer())
                  let res: Response | undefined
                  if (process.env.NEXT_PUBLIC_WORKERS_SERVER) {
                    res = await fetch(`${process.env.NEXT_PUBLIC_WORKERS_SERVER}/painter/genprompt/v4`, {
                      method: 'POST',
                      body: JSON.stringify({ image: Array.from(uint8array) })
                    })
                  } else {
                    res = await fetch('/api/prompt', {
                      method: 'POST',
                      body: JSON.stringify({ image: Array.from(uint8array) })
                    })
                  }
                  if (!res.ok) {
                    throw new Error(`${res.status}`)
                  }
                  const data = await res.json()
                  console.log(data)
                  const prompt = data.result.response as string
                  form.setFieldsValue({ prompt })
                  messageApi?.destroy('generating-prompt')
                  messageApi?.success('Prompt generated', 1)
                } catch (e) {
                  messageApi?.destroy('generating-prompt')
                  messageApi?.error(`Failed to generate prompt, error: ${e instanceof Error ? e.message : 'unknown'}`)
                } finally {
                  setDisabled(false)
                  return false
                }
              }}
            >
              <Button 
                disabled={disabled}
                loading={disabled}
              >
                Choose Image
              </Button>
            </Upload>)}
            trigger={['hover', 'click']}
          >
            <Button 
              disabled={disabled}
              loading={disabled}
              icon={<FileImageOutlined />}
            />
          </Popover>
          <Popover
            title='Generate Image'
            content='Add prompt and model to task list'
            trigger={['hover', 'click']}
          >
            <Button 
              htmlType='submit' 
              icon={<FileAddOutlined />}
            >
              Generate
            </Button>
          </Popover>
        </Space.Compact>
      </Form>
    </section>
  )
}
