'use client'

import NextImage from 'next/image'
import 'swiper/css'
import 'swiper/css/effect-cards'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCards } from 'swiper/modules'
import { useImageSize } from '../lib/useImageSize'
import { useZustand } from '../lib/useZustand'
import { Button, Popover, Tag } from 'antd'
import { addStaredImage, deleteStaredImage } from '../lib/utils'
import { DeleteOutlined, StarOutlined, StarFilled, InfoCircleOutlined } from '@ant-design/icons'

export default function Images({ containerID }: { containerID: string }) {

  const { images, setImages, messageApi } = useZustand()
  const imageSize = useImageSize(containerID)
  return (
    <section className='w-full h-full flex justify-center items-center'>
      {images.length > 0 ? (
        <Swiper
          modules={[EffectCards]}
          effect='cards'
          grabCursor={true}
          centeredSlides={true}
          style={{ width: imageSize, height: imageSize }}
        >
          {images.map((image) => (
            <SwiperSlide key={image.hash} className='w-full h-full relative flex justify-center items-center rounded-xl overflow-hidden'>
              <NextImage
                src={image.data}
                alt={image.prompt}
                width={imageSize}
                height={imageSize}
                className='object-cover'
              />
              <Popover
                title={(
                  <div>
                    Model & Prompt
                  </div>
                )}
                content={(
                  <div className='flex flex-col gap-2'>
                    <div>{image.prompt}</div>
                    <div>
                      <Tag 
                        className='m-0 mt-2 mr-2 cursor-pointer'
                        onClick={async () => {
                          try {
                            messageApi?.success('Copied to clipboard', 1)
                            await navigator.clipboard.writeText(image.prompt)
                          } catch {
                            messageApi?.error('Filed to copy, please copy manually')
                          }
                        }}
                      >
                        Click to Copy
                      </Tag>
                      <Tag className='m-0 mt-2'>{image.model}</Tag> 
                    </div>
                  </div>
                )}
                trigger={['hover', 'click']}
              >
                <div className='absolute top-0 right-0 m-2 px-2 py-1 bg-white dark:bg-gray-950 text-rose-950 dark:text-white rounded-md border'>
                  <InfoCircleOutlined />
                </div>
              </Popover>
              <Popover
                title='Delete Image'
                content={(
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={async () => {
                      await deleteStaredImage(image)
                      setImages((prev) => prev.filter((i) => i.hash !== image.hash))
                      messageApi?.success('Image deleted', 1)
                    }}
                    danger
                  >Confire Delete</Button>
                )}
                trigger={['hover', 'click']}
              >
                <div className='absolute top-0 right-10 m-2 px-2 py-1 bg-white dark:bg-gray-950 text-rose-950 dark:text-white rounded-md cursor-pointer border'>
                  <DeleteOutlined />
                </div>
              </Popover>
              <Popover
                title='Star Image'
                content='Unstarred images will disappear when the page is refreshed'
                trigger={['hover', 'click']}
              >
                <div className='absolute top-0 left-0 m-2'>
                  <Button
                    icon={image.star ? <StarFilled /> : <StarOutlined />}
                    onClick={async () => {
                      if (image.star) {
                        await deleteStaredImage(image)
                        setImages((prev) => prev.map((i) => i.hash === image.hash ? { ...i, star: false } : i))
                        messageApi?.success('Image unstared', 1)
                      } else {
                        await addStaredImage(image)
                        setImages((prev) => prev.map((i) => i.hash === image.hash ? { ...i, star: true } : i))
                        messageApi?.success('Image stared', 1)
                      }
                    }}
                  />
                </div>
              </Popover>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className='w-full h-full flex flex-col justify-center items-center gap-3'>
          <div className='font-bold text-lg'>No Images Here</div>
          <div>To generate an image:</div>
          <div>Step 1: Write your prompt below</div>
          <div>Step 2: Click the generate button</div>
          <div>Step 3: Wait for the image to load</div>
        </div>
      )}
    </section>
  )
}
