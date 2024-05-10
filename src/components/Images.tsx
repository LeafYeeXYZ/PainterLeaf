import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/effect-cards'
import { EffectCards } from 'swiper/modules'
import { DownloadOutlined, DeleteOutlined, StarOutlined, StarFilled, InfoCircleOutlined } from '@ant-design/icons'
import { update } from 'idb-keyval'
import '../styles/Images.css'
import { Image } from './App.tsx'
import { DialogAction } from '../libs/useDialog.tsx'

interface ImageProps {
  currentImages: Image[]
  setCurrentImages: React.Dispatch<React.SetStateAction<Image[]>>
  langMode: 'zh' | 'en'
  dialogAction: React.Dispatch<DialogAction>
  status: React.MutableRefObject<string>
  loadingImage: React.JSX.Element | null
}

function Images({ currentImages, setCurrentImages, langMode, dialogAction, status, loadingImage }: ImageProps) {
  // 操作进行前检测函数
  function callback(e: React.MouseEvent, image: Image, func: (image: Image) => Promise<void>) {
    e.preventDefault()
    if (status.current) {
      dialogAction({ type: 'open', title: '提示', content: `请等待${status.current}完成` })
    } else {
      // 处理操作
      func(image)
        .then(() => status.current = '')
        .catch(error => alert(`未捕获: Images -> ${func.name} -> ${error}`))
    }
  }

  // 收藏按钮点击事件
  async function handleStar(image: Image) {
    status.current = '收藏'
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
      error instanceof Error && dialogAction({ type: 'open', title: '收藏失败', content: `Images -> handleStar -> ${error.name}: ${error.message}` })
    }
  }
  // 提示词按钮点击事件
  async function handleInfo(image: Image) {
    status.current = '提示词'
    dialogAction({ type: 'open', title: '本图提示词', content: image.prompt })
  }
  // 删除按钮点击事件
  async function handleDelete(image: Image) {
    status.current = '删除'
    if (image.star) {
      dialogAction({ type: 'open', title: '错误', content: '请先取消收藏再删除' })
    } else {
      setCurrentImages(prev => prev.filter(item => item.hash !== image.hash))
    }
  }
  // 下载按钮点击事件
  async function handleDownload(image: Image) {
    status.current = '下载'
    const filename = `${Date.now().toString()}.png`
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
        <div className='image-funcs'>

          <div className='image-funcs-left'>

            <button 
              className='image-marker' 
              onClick={e => callback(e, image, handleStar)}
            >{ image.star ? <StarFilled /> : <StarOutlined /> }</button>

          </div>

          <div className='image-funcs-right'>

            <button
              className='image-info' 
              onClick={e => callback(e, image, handleInfo)}
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
        <span>
          这里是赛博画师小叶子<br />
          在下方输入<span className='images-intro-lang'>{langMode === 'zh' ? '中文' : '英文'}</span>提示词并点击生成<br />
          大部分模型输入自然语言即可<br />
          本站开源于 <a href='https://github.com/LeafYeeXYZ/PainterLeaf' target='_blank'>GitHub ↗</a>
        </span>
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
