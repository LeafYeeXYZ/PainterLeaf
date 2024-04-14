import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/effect-cards'
import { EffectCards } from 'swiper/modules'
import PropTypes from 'prop-types'
import '../styles/Images.css'
import localforage from 'localforage'
import { DownloadOutlined, DeleteOutlined, StarOutlined, StarFilled } from '@ant-design/icons'
import getHash from '../libs/getHash'

// 尝试从 localforage 中获取 加载图片
// 如果不存在则向服务器请求
let imgurl = ''
const loadingImage = await localforage.getItem('loadingImage')
if (!loadingImage) {
  const res = await fetch('/loading.gif')
  const blob = await res.blob()
  imgurl = URL.createObjectURL(blob)
  await localforage.setItem('loadingImage', blob)
} else {
  imgurl = URL.createObjectURL(loadingImage)
}

function Images({ images, setImages, zhMode, dialogAction }) {
  // 删除按钮点击事件
  async function handleDelete(event) {
    event.preventDefault()
    const url = event.target.href || event.target.parentElement.href || event.target.parentElement.parentElement.href || event.target.parentElement.parentElement.parentElement.href
    const hash = await getHash(url)
    const index = images.findIndex(image => image.hash === hash)
    // 如果已收藏，弹出提示框
    if (images[index].star === 'stared') {
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
      const star = images[index].star
      // 获取图片 blob
      const blob = await (await fetch(url)).blob()    
      // 如果收藏, 则将图片信息存入 localforage
      if (star === 'notStared') {
        // 获取已收藏图片列表
        const staredImages = (await localforage.getItem('staredImages')) || []
        // 将图片信息存入 localforage
        staredImages.push({ hash, blob })
        await localforage.setItem('staredImages', staredImages)
      }
      // 如果取消收藏, 则从 localforage 中删除
      else {
        // 获取已收藏图片列表
        const staredImages = await localforage.getItem('staredImages')
        // 从 localforage 中删除
        await localforage.setItem('staredImages', staredImages.filter(image => image.hash !== hash))
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
          <img src={imgurl} className='image-loading image-item' /> :
          <img src={image.url} className='image-item' />
        }
        <div className='image-funcs'>
        { 
          image.type === 'loading' ||
          <a href={image.url} className='image-marker' onClick={handleStar}>{ image.star === 'stared' ? <StarFilled /> : <StarOutlined /> }</a>
        }
        { 
          image.type === 'loading' ||
          <a href={image.url} download className='image-downloader'><DownloadOutlined /></a>
        }
        { 
          image.type === 'loading' ||
          <a href={image.url} className='image-deleter' onClick={handleDelete}><DeleteOutlined /></a>
        }
        </div>
      </SwiperSlide>
    )
  })

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
      {
        images.length === 0 ||
        <Swiper
          effect={'cards'}
          grabCursor={true}
          modules={[EffectCards]}
          className="images-swiper"
        >
          {slides}
        </Swiper>
      }
    </div>
  )
}

Images.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      star: PropTypes.string.isRequired,
    }),
  ).isRequired,
  setImages: PropTypes.func.isRequired,
  zhMode: PropTypes.bool.isRequired,
  dialogAction: PropTypes.func.isRequired,
}

export default Images
