import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/effect-cards'
import { EffectCards } from 'swiper/modules'
import { DownloadOutlined, DeleteOutlined, StarOutlined, StarFilled, InfoCircleOutlined } from '@ant-design/icons'
import { update } from 'idb-keyval'
import '../styles/Images.css'
import { Image } from './App.tsx'
import { DialogAction } from '../libs/useDialog.tsx'
import { useContext } from 'react'
import { LangContext } from '../lang'

interface ImageProps {
  currentImages: Image[]
  setCurrentImages: React.Dispatch<React.SetStateAction<Image[]>>
  langMode: 'zh' | 'en'
  dialogAction: React.Dispatch<DialogAction>
  status: React.RefObject<string>
  loadingImage: React.ReactElement | null
}

function Images({ currentImages, setCurrentImages, langMode, dialogAction, status, loadingImage }: ImageProps) {

  // 语言包
  const t = useContext(LangContext)

  // 操作进行前检测函数
  function callback(e: React.MouseEvent, image: Image, func: (image: Image) => Promise<void>) {
    e.preventDefault()
    if (status.current) {
      dialogAction({ type: 'open', title: t.info, content: t.wait.replace('${status.current}', status.current) })
    } else {
      // 处理操作
      func(image)
        .then(() => status.current = '')
        .catch(error => alert(`Not Catched Error: Images -> ${func.name} -> ${error}`))
    }
  }

  // 收藏按钮点击事件
  async function handleStar(image: Image) {
    status.current = t.star
    try {
      if (image.star) {
        // 如果取消收藏, 从 IndexedDB 中删除
        await update('staredImages', staredImages => {
          const modifiedImages = staredImages.filter((item: Image) => item.hash !== image.hash)
          return modifiedImages
        })
      } else {
        // 如果收藏, 则将图片信息存入 IndexedDB
        await update('staredImages', staredImages => {
          staredImages.push({ 
            base64: image.base64,
            hash: image.hash,
            prompt: image.prompt,
            star: true,
            type: 'image',
          })
          return staredImages
        })
      }
      // 更新图片列表
      setCurrentImages(prev => prev.map(item => item.hash === image.hash ? { ...item, star: !item.star } : item))
    } catch (error) {
      error instanceof Error && dialogAction({ type: 'open', title: t.starFail, content: `Images -> handleStar -> ${error.name}: ${error.message}` })
    }
  }
  // 提示词按钮点击事件
  function handleInfo(image: Image) {
    dialogAction({ type: 'open', title: t.promptInfo, content: image.prompt })
  }
  // 删除按钮点击事件
  async function handleDelete(image: Image) {
    status.current = t.delete
    if (image.star) {
      dialogAction({ type: 'open', title: t.error, content: t.deleteInfo })
    } else {
      setCurrentImages(prev => prev.filter(item => item.hash !== image.hash))
    }
  }
  // 下载按钮点击事件
  async function handleDownload(image: Image) {
    status.current = t.download
    const filename = Date.now().toString()
    const a = document.createElement('a')
    a.href = image.base64
    a.download = filename
    a.click()
  }

  // 渲染图片列表
  const slides = currentImages.map(image => 
    <SwiperSlide className='image-slide' key={image.hash}>
      <img src={image.base64} className={image.type === 'loading' ? 'image-loading image-item' : 'image-item'} />
      { 
        image.type === 'image' &&
        <div 
          className='image-funcs'
          style={{
            '--text-star': `"${t.star}"`,
            '--text-star-width': `${t.star.length}${t.lang === 'en' ? 'ch' : 'rem'}`,
            '--text-prompt': `"${t.prompt}"`,
            '--text-prompt-width': `${t.prompt.length}${t.lang === 'en' ? 'ch' : 'rem'}`,
            '--text-download': `"${t.download}"`,
            '--text-download-width': `${t.download.length}${t.lang === 'en' ? 'ch' : 'rem'}`,
            '--text-delete': `"${t.delete}"`,
            '--text-delete-width': `${t.delete.length}${t.lang === 'en' ? 'ch' : 'rem'}`,
          } as React.CSSProperties}
        >

          <div className='image-funcs-left'>

            <button 
              className='image-marker' 
              onClick={e => callback(e, image, handleStar)}
            >{image.star ? <StarFilled /> : <StarOutlined />}</button>

          </div>

          <div className='image-funcs-right'>

            <button
              className='image-info' 
              onClick={() => handleInfo(image)}
            ><InfoCircleOutlined /></button>

            <button
              className='image-downloader' 
              onClick={e => callback(e, image, handleDownload)}
            ><DownloadOutlined /></button>

            <button
              className='image-deleter' 
              onClick={e => callback(e, image, handleDelete)}
            ><DeleteOutlined /></button>

          </div>

        </div>
      }
    </SwiperSlide>
  )

  return (
    <div className="images-container">

      <div className="images-intro">
        {t.siteIntro(t.lang === 'en' ? (langMode === 'zh' ? 'Chinese' : 'English') : (langMode === 'zh' ? '中文' : '英文'))}
      </div>

      { (currentImages.length || loadingImage) && (
        <Swiper
          effect={'cards'}
          grabCursor={true}
          modules={[EffectCards]}
          className="images-swiper"
        >
          {loadingImage}
          {slides}
        </Swiper>
      ) }
      
    </div>
  )
}

export default Images
