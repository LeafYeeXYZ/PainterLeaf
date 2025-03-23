'use client'

import { Card, Button, Tag } from 'antd'
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons'
import { useZustand } from '../lib/useZustand'

export default function Tasks() {
  const tasks = useZustand((state) => state.tasks)
  const setTasks = useZustand((state) => state.setTasks)
  return (
    <section className='w-full h-full flex justify-center items-center overflow-hidden py-4'>
      {tasks.length > 0 ? (
        <div className='w-full h-full flex flex-col justify-start items-center overflow-auto max-w-xl gap-4'>
          {tasks.map((task) => (
            <Card
              key={task.createTimestamp}
              className='w-full'
              size='small'
              title={
                <div>
                  <Tag
                    icon={
                      task.status === 'generating' ? (
                        <LoadingOutlined />
                      ) : undefined
                    }
                    color={
                      task.status === 'success'
                        ? 'green'
                        : task.status === 'error'
                          ? 'red'
                          : 'blue'
                    }
                  >
                    {task.status}
                  </Tag>
                  <Tag>{task.model}</Tag>
                </div>
              }
              extra={
                <Button
                  type='text'
                  icon={<DeleteOutlined />}
                  onClick={() =>
                    setTasks((prev) =>
                      prev.filter(
                        (t) => t.createTimestamp !== task.createTimestamp,
                      ),
                    )
                  }
                  disabled={task.status === 'generating'}
                />
              }
            >
              <div>
                {task.error ||
                  `${task.trigger ? `${task.trigger}, ` : ''}${task.prompt}`}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className='w-full h-full flex flex-col justify-center items-center gap-3'>
          <div className='text-xl font-bold'>No Tasks Yet</div>
          <div>To generate an image:</div>
          <div>Step 1: Write your prompt below</div>
          <div>Step 2: Click the generate button</div>
          <div>Step 3: Wait for the image to load</div>
        </div>
      )}
    </section>
  )
}
