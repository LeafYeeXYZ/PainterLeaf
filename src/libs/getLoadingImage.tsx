import { get, set } from 'idb-keyval'
import { blobToBase64 } from './base64_blob.ts'
import { SwiperSlide } from 'swiper/react'

/** 获取加载图片 */
export default async function getLoadingImage(): Promise<React.JSX.Element> {
  // 首先尝试从 IndexedDB 中获取加载图片
  const loadingImage = await get('loadingImage')
  // 如果不存在则向服务器请求
  if (!loadingImage || typeof loadingImage !== 'object') {
    const res = await fetch('/loading.gif')
    const blob = await res.blob()
    await set('loadingImage', blob)
    const base64 = await blobToBase64(blob)
    return (
      <SwiperSlide className='image-slide' key='loading'>
        <img src={base64} className='image-loading image-item' />
      </SwiperSlide>
    )
  } else {
    const base64 = await blobToBase64(loadingImage)
    return (
      <SwiperSlide className='image-slide' key='loading'>
        <img src={base64} className='image-loading image-item' />
      </SwiperSlide>
    )
  }
}