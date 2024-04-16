import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/effect-cards'
import { EffectCards } from 'swiper/modules'
import PropTypes from 'prop-types'
import '../styles/Images.css'
import { DownloadOutlined, DeleteOutlined, StarOutlined, StarFilled, InfoCircleOutlined } from '@ant-design/icons'
import { update, get } from 'idb-keyval'
import { cloneDeep } from 'lodash-es'
import Img from './Img.jsx'
import { getItem } from 'localforage'

function Images({ images, setImages, zhMode, dialogAction }) {
  // 从不同渠道获取 Blob
  async function getBlob(image) {
    // localforage -> staredImages -> image.blob
    const blob = await getItem(image.hash)
    if (blob && blob.size > 4096) {
      return blob
    }
    const staredImages = await get('staredImages')
    const value = staredImages.find(item => item.hash === image.hash)
    if (value && value.blob.size > 4096) {
      return value.blob
    }
    return image.blob
  }
  // 删除按钮点击事件
  async function handleDelete(image) {
    // 如果已收藏，弹出提示框
    if (image.star) {
      dialogAction({ type: 'open', title: '错误', content: '请先取消收藏再删除' })
      return
    }
    // 如果没有收藏，直接删除
    else {
      let modifiedImages = cloneDeep(images)
      modifiedImages = modifiedImages.filter(item => item.hash !== image.hash)
      setImages(modifiedImages)
    }
  }
  // 下载按钮点击事件
  async function handleDownload(image) {
    const blob = await getBlob(image)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const reg = /\(([^)]*)\)/
    a.href = url
    a.download = `${image.prompt.replace(reg, '').trim()}.png`
    a.click()
    URL.revokeObjectURL(url)
  }
  // 收藏按钮点击事件
  async function handleStar(image, element) {
    try {
      // 禁用按钮
      element.disabled = true
      element.style.cursor = 'not-allowed'
      // 如果取消收藏, 从 IndexedDB 中删除
      if (image.star) {
        await update('staredImages', staredImages => {
          return staredImages.filter(item => item.hash !== image.hash)
        })
      }
      // 如果收藏, 则将图片信息存入 IndexedDB
      else {
        const blob = await getBlob(image)
        await update('staredImages', staredImages => {
          staredImages.push({ blob, hash: image.hash, prompt: image.prompt })
          return staredImages
        })
      }
      // 启用按钮
      element.disabled = false
      element.style.cursor = 'pointer'
      // 更新图片列表
      let modifiedImages = cloneDeep(images)
      modifiedImages = modifiedImages.map(item => {
        if (item.hash === image.hash) {
          item.star = !item.star
        }
        return item
      })      
      setImages(modifiedImages)
    } catch (error) {
      // 启用按钮
      element.disabled = false
      element.style.cursor = 'pointer'
      // 打开对话框
      dialogAction({ type: 'open', title: '收藏失败', content: `Images -> handleStar -> ${error}` })
    }
  }

  // 渲染图片列表
  const slides = []
  for (const image of images) {
    slides.push(
      <SwiperSlide key={image.hash} className='image-slide'>
        <Img blob={image.blob} className={image.type === 'loading' ? 'image-loading image-item' : 'image-item'} hash={image.hash} />
        { 
          image.type === 'image' &&
          <div className='image-funcs'>

            <div className='image-funcs-left'>

              <a id={`star_${image.hash}`} className='image-marker' onClick={e => {
                e.preventDefault()
                const element = document.getElementById(`star_${image.hash}`)
                handleStar(image, element).catch(error => alert(`未捕获: Images -> handleStar -> ${error}`))
              }}>{ image.star ? <StarFilled /> : <StarOutlined /> }</a>

            </div>

            <div className='image-funcs-right'>

              <a data-hash={image.hash} className='image-info' onClick={e => {
                e.preventDefault()
                dialogAction({ type: 'open', title: '本图提示词', content: image.prompt })
              }}><InfoCircleOutlined /></a>

              <a className='image-downloader' onClick={e => {
                e.preventDefault()
                handleDownload(image).catch(error => alert(`未捕获: Images -> handleDownload -> ${error}`))
              }}><DownloadOutlined /></a>

              <a data-hash={image.hash} className='image-deleter' onClick={e => {
                e.preventDefault()
                handleDelete(image).catch(error => alert(`未捕获: Images -> handleDelete -> ${error}`))
              }}><DeleteOutlined /></a>

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