import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/effect-cards'
import { EffectCards } from 'swiper/modules'
import PropTypes from 'prop-types'
import '../styles/Images.css'
import { DownloadOutlined, DeleteOutlined, StarOutlined, StarFilled, InfoCircleOutlined } from '@ant-design/icons'
import { update } from 'idb-keyval'
import { useEffect, useState } from 'react'
import { cloneDeep } from 'lodash-es'

function Img ({ blob, className, hash }) {
  // 这下应该只有这个组件涉及到 createObjectURL 和 revokeObjectURL 了
  const [objectURL, setObjectURL] = useState('')
  useEffect(() => {
    const cache = sessionStorage.getItem(hash)
    if (cache) {
      setObjectURL(cache)
    } else {
      const url = URL.createObjectURL(blob)
      setObjectURL(url)
      sessionStorage.setItem(hash, url)
    }
    return () => {
      if (objectURL) {
        URL.revokeObjectURL(objectURL)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if (!objectURL) {
    return <div className={className}></div>
  }
  return <img src={objectURL} className={className} />
}

Img.propTypes = {
  blob: PropTypes.instanceOf(Blob).isRequired,
  className: PropTypes.string,
  hash: PropTypes.string.isRequired,
}

function Images({ images, setImages, zhMode, dialogAction }) {
  // 下载按钮点击事件
  function handleDownload(event) {
    event.preventDefault()
    // 获取图片
    const hash = event.target.dataset.hash || event.target.parentElement.dataset.hash || event.target.parentElement.parentElement.dataset.hash || event.target.parentElement.parentElement.parentElement.dataset.hash
    const index = images.findIndex(image => image.hash === hash)
    if (index === -1) {
      dialogAction({ type: 'open', title: '错误', content: '未找到图片' })
      return
    }
    // 创建 a 标签
    const a = document.createElement('a')
    const url = sessionStorage.getItem(hash)
    if (!url) {
      dialogAction({ type: 'open', title: '错误', content: '未找到图片' })
      return
    }
    a.href = url
    // 把提示词删去 (xxx 后作为文件名
    // 如 cute cat (xxx xxx) 只保留 cat
    const reg = /\(([^)]*)\)/
    a.download = `${images[index].prompt.replace(reg, '').trim()}.png`
    a.click()
  }

  // 删除按钮点击事件
  async function handleDelete(event) {
    event.preventDefault()
    // 获取图片
    const hash = event.target.dataset.hash || event.target.parentElement.dataset.hash || event.target.parentElement.parentElement.dataset.hash || event.target.parentElement.parentElement.parentElement.dataset.hash
    const index = images.findIndex(image => image.hash === hash)
    if (index === -1) {
      dialogAction({ type: 'open', title: '错误', content: '未找到图片' })
      return
    }
    // 如果已收藏，弹出提示框
    else if (images[index].star) {
      dialogAction({ type: 'open', title: '错误', content: '请先取消收藏再删除' })
      return
    }
    // 如果没有收藏，直接删除
    else {
      let modifiedImages = cloneDeep(images)
      modifiedImages = modifiedImages.filter(image => image.hash !== hash)
      setImages(modifiedImages)
    }
  }

  // 收藏按钮点击事件
  async function handleStar(event) {
    event.preventDefault()
    // 禁用按钮
    event.target.disabled = true
    event.target.style.cursor = 'not-allowed'
    try {
      // 获取图片 hash
      const hash = event.target.dataset.hash || event.target.parentElement.dataset.hash || event.target.parentElement.parentElement.dataset.hash || event.target.parentElement.parentElement.parentElement.dataset.hash
      // 获取图片 index
      const index = images.findIndex(image => image.hash === hash)
      if (index === -1) throw '未找到图片'
      // 获取图片信息
      const star = images[index].star
      const prompt = images[index].prompt || '获取失败'
      const blob = images[index].blob
      // 如果收藏, 则将图片信息存入 IndexedDB
      if (!star) {
        await update('staredImages', staredImages => {
          staredImages.push({ hash, blob, prompt })
          return staredImages
        })
      }
      // 如果取消收藏, 则从 IndexedDB 中删除
      else {
        await update('staredImages', staredImages => {
          const result = staredImages.filter(image => image.hash !== hash)
          return result
        })
      }
      // 启用按钮
      event.target.disabled = false
      event.target.style.cursor = 'pointer'
      // 更新图片列表
      const modifiedImages = cloneDeep(images)
      modifiedImages[index].star = !star
      setImages(modifiedImages)
    } catch (error) {
      // 启用按钮
      event.target.disabled = false
      event.target.style.cursor = 'pointer'
      // 打开对话框
      dialogAction({ type: 'open', title: '收藏失败', content: error.message || error })
    }
  }

  // 渲染图片列表
  const slides = []
  for (const image of images) {
    slides.push(
      <SwiperSlide key={image.hash} className='image-slide'>
        <Img blob={image.blob} className={image.type === 'loading' ? 'image-loading image-item' : 'image-item'} hash={image.hash} />
        { 
          image.type === 'loading' ||
          <div className='image-funcs'>

            <div className='image-funcs-left'>
              <a data-hash={image.hash} className='image-marker' onClick={handleStar}>{ image.star ? <StarFilled /> : <StarOutlined /> }</a>
            </div>

            <div className='image-funcs-right'>
              <a data-hash={image.hash} className='image-info'
                onClick={e => {
                  e.preventDefault()
                  dialogAction({ type: 'open', title: '本图提示词', content: image.prompt || '获取失败' })
                }}              
              ><InfoCircleOutlined /></a>
              <a data-hash={image.hash} className='image-downloader' onClick={handleDownload}><DownloadOutlined /></a>
              <a data-hash={image.hash} className='image-deleter' onClick={handleDelete}><DeleteOutlined /></a>
            </div>

          </div>
        }
      </SwiperSlide>
    )
  }

  // 渲染 Swiper
  const swiper = (
    <Swiper
      effect={'cards'}
      grabCursor={true}
      modules={[EffectCards]}
      className="images-swiper"
    >
      {slides}
    </Swiper>
  )

  return (
    <div className="images-container">

      <div className="images-intro">
        <span>
          这里是赛博画师小叶子<br />
          在下方输入<span className='images-intro-lang'>{zhMode ? '中文' : '英文'}</span>提示词并点击生成<br />
          大部分模型输入自然语言即可<br />
          本站开源于 <a href='https://github.com/LeafYeeXYZ/PainterLeaf' target='_blank'>GitHub ↗</a>
        </span>
      </div>

      { slides && swiper }
      
    </div>
  )
}

Images.propTypes = {
  images: PropTypes.array.isRequired,
  setImages: PropTypes.func.isRequired,
  zhMode: PropTypes.bool.isRequired,
  dialogAction: PropTypes.func.isRequired,
}

export default Images