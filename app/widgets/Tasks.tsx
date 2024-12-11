'use client'

import { Card, Button, Tag } from 'antd'
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons'
import { useZustand } from '../lib/useZustand'

export default function Tasks() {

  const { tasks, setTasks } = useZustand()
  return (
    <section className='w-full h-full flex justify-center items-center overflow-hidden py-4'>
      {tasks.length > 0 ? (
        <div className='w-full h-full flex flex-col justify-start items-center overflow-auto max-w-xl'>
          {tasks.map((task) => (
            <Card
              key={task.createTimestamp}
              className='w-full mb-4'
              size='small'
              title={
                <p>
                  <Tag 
                    icon={task.status === 'generating' ? <LoadingOutlined /> : undefined}
                    color={task.status === 'success' ? 'green' : task.status === 'error' ? 'red' : 'blue'}
                  >
                    {task.status}
                  </Tag>
                  <Tag>
                    {task.model}
                  </Tag>
                </p>
              }
              extra={
                <Button
                  type='text'
                  icon={<DeleteOutlined />}
                  onClick={() => setTasks((prev) => prev.filter((t) => t.createTimestamp !== task.createTimestamp))}
                  disabled={task.status === 'generating'}
                />
              }
            >
              <p>
                {task.error || `${task.trigger ? `${task.trigger}, ` : ''}${task.prompt}`}
              </p>
            </Card>
          ))}
        </div>
      ) : (
        <p className='w-full h-full flex flex-col justify-center items-center gap-3'>
          <p className='text-xl font-bold'>No Tasks Yet</p>
          <p>To generate an image:</p>
          <p>Step 1: Write your prompt below</p>
          <p>Step 2: Click the generate button</p>
          <p>Step 3: Wait for the image to load</p>
        </p>
      )}
    </section>
  )
}