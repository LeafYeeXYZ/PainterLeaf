'use client'

import { Segmented, Badge } from 'antd'
import {
  PictureOutlined,
  BarsOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { useState } from 'react'
import Images from '../widgets/Images'
import Tasks from '../widgets/Tasks'
import Config from '../widgets/Config'
import { useZustand } from '../lib/useZustand'

export default function Painting() {
  const tasks = useZustand((state) => state.tasks)
  const containerID = 'images-container'
  const [page, setPage] = useState<React.ReactNode>(
    <Images containerID={containerID} />,
  )
  return (
    <section className='w-full h-full overflow-hidden relative px-4'>
      <div className='flex justify-center items-center pb-1 pt-5'>
        <Badge
          size='small'
          count={
            tasks.filter(
              (task) => task.status !== 'success' && task.status !== 'error',
            ).length
          }
        >
          <Segmented
            className='border dark:border-[#424242]'
            options={[
              { value: 'Config', icon: <SettingOutlined />, label: 'Config' },
              { value: 'Images', icon: <PictureOutlined />, label: 'Images' },
              { value: 'Tasks', icon: <BarsOutlined />, label: 'Tasks' },
            ]}
            onChange={(value) => {
              switch (value) {
                case 'Config':
                  setPage(<Config />)
                  break
                case 'Images':
                  setPage(<Images containerID={containerID} />)
                  break
                case 'Tasks':
                  setPage(<Tasks />)
                  break
              }
            }}
            defaultValue='Images'
          />
        </Badge>
      </div>
      <div
        className='w-full h-[calc(100%-3.5rem)] overflow-visible relative'
        id={containerID}
      >
        {page}
      </div>
    </section>
  )
}
