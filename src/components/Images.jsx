import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/effect-cards'
import { EffectCards } from 'swiper/modules'
import PropTypes from 'prop-types'
import '../styles/Images.css'
import { DownloadOutlined, DeleteOutlined, StarOutlined, StarFilled, InfoCircleOutlined } from '@ant-design/icons'
import getHash from '../libs/getHash'
import getLoadingImage from '../libs/getLoadingImage'
import { update } from 'idb-keyval'

// 获取加载图片
const loadingImage = await getLoadingImage()

function Images({ images, setImages, zhMode, dialogAction }) {
  // 删除按钮点击事件
  async function handleDelete(event) {
    event.preventDefault()
    const url = event.target.href || event.target.parentElement.href || event.target.parentElement.parentElement.href || event.target.parentElement.parentElement.parentElement.href
    const hash = await getHash(url)
    const index = images.findIndex(image => image.hash === hash)
    // 如果没有获取到 index, 则报错
    if (index === -1) {
      dialogAction({ type: 'open', title: '错误', content: '未找到图片' })
      return
    }
    // 如果已收藏，弹出提示框
    else if (images[index].star === 'stared') {
      dialogAction({ type: 'open', title: '错误', content: '请先取消收藏再删除' })
      return
    }
    // 如果没有收藏，直接删除
    else {
      URL.revokeObjectURL(url)
      setImages(images.filter(image => image.url !== url))
    }
  }

  // 收藏按钮点击事件
  async function handleStar(event) {
    event.preventDefault()
    // 禁用按钮
    event.target.disabled = true
    event.target.style.cursor = 'not-allowed'
    try {
      // 获取图片 URL
      const url = event.target.href || event.target.parentElement.href || event.target.parentElement.parentElement.href || event.target.parentElement.parentElement.parentElement.href
      // 获取图片 hash
      const hash = await getHash(url)
      // 获取图片 index
      const index = images.findIndex(image => image.hash === hash)
      // 如果没有获取到 index, 则报错
      if (index === -1) throw '未找到图片'
      // 获取图片信息
      const star = images[index].star
      const prompt = images[index].prompt || '获取失败'
      // 获取图片 blob
      const blob = await (await fetch(url)).blob()
      // 如果收藏, 则将图片信息存入 IndexedDB
      if (star === 'notStared') {
        await update('staredImages', staredImages => {
          staredImages.push({ hash, blob, prompt })
          return staredImages
        })
      }
      // 如果取消收藏, 则从 localforage 中删除
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
      setImages(draft => {
        draft[index].star = star === 'notStared' ? 'stared' : 'notStared'
        return
      })
    } catch (error) {
      // 启用按钮
      event.target.disabled = false
      event.target.style.cursor = 'pointer'
      // 打开对话框
      dialogAction({ type: 'open', title: '收藏失败', content: error.message || error })
    }
  }

  // 渲染图片列表
  const slides = images.map(image => {
    return (
      <SwiperSlide key={image.url} className='image-slide'>
        {
          image.type === 'loading' ? 
          <img src={loadingImage} className='image-loading image-item' /> :
          <img src={image.url} className='image-item' />
        }
        { 
          image.type === 'loading' ||
          <div className='image-funcs'>

            <div className='image-funcs-left'>
              <a href={image.url} className='image-marker' onClick={handleStar}>{ image.star === 'stared' ? <StarFilled /> : <StarOutlined /> }</a>
            </div>

            <div className='image-funcs-right'>
              <a href={image.url} className='image-info'
                onClick={e => {
                  e.preventDefault()
                  dialogAction({ type: 'open', title: '本图提示词', content: image.prompt || '获取失败' })
                }}              
              ><InfoCircleOutlined /></a>
              <a href={image.url} download className='image-downloader'><DownloadOutlined /></a>
              <a href={image.url} className='image-deleter' onClick={handleDelete}><DeleteOutlined /></a>
            </div>

          </div>
        }
      </SwiperSlide>
    )
  })

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

      { images.length === 0 || swiper }
      
    </div>
  )
}

Images.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      star: PropTypes.string.isRequired,
      hash: PropTypes.string.isRequired,
      prompt: PropTypes.string.isRequired,
    }),
  ).isRequired,
  setImages: PropTypes.func.isRequired,
  zhMode: PropTypes.bool.isRequired,
  dialogAction: PropTypes.func.isRequired,
}

export default Images
