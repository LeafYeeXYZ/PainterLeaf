import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/effect-cards'
import { EffectCards } from 'swiper/modules'
import PropTypes from 'prop-types'
import '../styles/Images.css'
import localforage from 'localforage'
import { DownloadOutlined } from '@ant-design/icons'

// 尝试从 localforage 中获取加载图片
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

function Images({ images, zhMode }) {
  // 将 images 倒置
  images = images.slice().reverse()
  // 渲染图片列表
  const slides = images.map(image => {
    return (
      <SwiperSlide key={image.url} className='image-slide'>
        {
          image.type === 'loading' ? 
          <img src={imgurl} className='image-loading image-item' /> :
          <img src={image.url} className='image-item' />
        }
        { 
          image.type === 'loading' ||
          <a href={image.url} download className='image-downloader'><DownloadOutlined /></a>
        }
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
          本站源码开源于 <a href='https://github.com/LeafYeeXYZ/PainterLeaf' target='_blank'>GitHub ↗</a>
        </span>
      </div>
      <Swiper
        effect={'cards'}
        grabCursor={true}
        modules={[EffectCards]}
        className="images-swiper"
        style={{ display: images.length ? 'block' : 'none' }}
      >
        {slides}
      </Swiper>
    </div>
  )
}

Images.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ).isRequired,
  zhMode: PropTypes.bool.isRequired,
}

export default Images