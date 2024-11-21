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

  const { images, setImages } = useZustand()
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
                title='Model & Prompt'
                content={(
                  <p>
                    {image.prompt}
                    <br />
                    <Tag className='m-0 mt-2'>{image.model}</Tag> 
                  </p>
                )}
                trigger={['hover', 'click']}
              >
                <p className='absolute top-0 right-0 m-2 px-2 py-1 bg-white dark:bg-gray-950 text-rose-950 dark:text-white rounded-md border'>
                  <InfoCircleOutlined />
                </p>
              </Popover>
              <Popover
                title='Delete Image'
                content={(
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={async () => {
                      await deleteStaredImage(image)
                      setImages((prev) => prev.filter((i) => i.hash !== image.hash))
                    }}
                    danger
                  >Confire Delete</Button>
                )}
                trigger={['hover', 'click']}
              >
                <p className='absolute top-0 right-10 m-2 px-2 py-1 bg-white dark:bg-gray-950 text-rose-950 dark:text-white rounded-md cursor-pointer border'>
                  <DeleteOutlined />
                </p>
              </Popover>
              <Popover
                title='Star Image'
                content='Unstarred images will disappear when the page is refreshed'
                trigger={['hover', 'click']}
              >
                <Button
                  className='absolute top-0 left-0 m-2'
                  icon={image.star ? <StarFilled /> : <StarOutlined />}
                  onClick={async () => {
                    if (image.star) {
                      await deleteStaredImage(image)
                      setImages((prev) => prev.map((i) => i.hash === image.hash ? { ...i, star: false } : i))
                    } else {
                      await addStaredImage(image)
                      setImages((prev) => prev.map((i) => i.hash === image.hash ? { ...i, star: true } : i))
                    }
                  }}
                />
              </Popover>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className='w-full h-full flex justify-center items-center'>
          No Images
        </p>
      )}
    </section>
  )
}
