import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/effect-cards'
import { EffectCards } from 'swiper/modules'
import { DownloadOutlined, DeleteOutlined, StarOutlined, StarFilled, InfoCircleOutlined } from '@ant-design/icons'
import { update } from 'idb-keyval'
import { cloneDeep } from 'lodash-es'
import PropTypes from 'prop-types'
import '../styles/Images.css'

function Images({ images, setImages, zhMode, dialogAction }) {
  // 收藏按钮点击事件
  async function handleStar(image, element) {
    try {
      // 禁用按钮
      element.disabled = true
      element.style.cursor = 'progress'
      if (image.star) {
        // 如果取消收藏, 从 IndexedDB 中删除
        await update('staredImages', staredImages => {
          const modifiedImages = staredImages.filter(item => item.hash !== image.hash)
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
      await new Promise(resolve => setTimeout(resolve, 2000))
      // 更新图片列表
      const modifiedImages = cloneDeep(images)
      modifiedImages.forEach(item => {
        if (item.hash === image.hash) {
          item.star = !item.star
        }
      })
      setImages(modifiedImages)
    } catch (error) {
      // 打开对话框
      dialogAction({ type: 'open', title: '收藏失败', content: `Images -> handleStar -> ${error}` })
    } finally {
      // 启用按钮
      element.disabled = false
      element.style.cursor = 'pointer'
    }
  }

  // 渲染图片列表
  const slides = images.map(image => 
    <SwiperSlide className='image-slide' key={image.hash}>
      <img src={image.base64} className={image.type === 'loading' ? 'image-loading image-item' : 'image-item'} />
      { 
        image.type === 'image' &&
        <div className='image-funcs'>

          <div className='image-funcs-left'>

            <button id={image.hash} className='image-marker' onClick={e => {
              e.preventDefault()
              const element = document.getElementById(image.hash)
              handleStar(image, element).catch(error => alert(`未捕获: Images -> handleStar -> ${error}`))
            }}>{ image.star ? <StarFilled /> : <StarOutlined /> }</button>

          </div>

          <div className='image-funcs-right'>

            <button
              className='image-info' 
              onClick={e => {
                e.preventDefault()
                dialogAction({ type: 'open', title: '本图提示词', content: image.prompt })
            }}><InfoCircleOutlined /></button>

            <a 
              className='image-downloader' 
              href={image.base64} 
              download={`${image.prompt.replace(/\(([^)]*)\)/, '').trim()}.png`}
            ><DownloadOutlined /></a>

            <button
              className='image-deleter' 
              onClick={e => {
                e.preventDefault()
                const loading = document.querySelector('.image-loading')
                if (loading) {
                  dialogAction({ type: 'open', title: '错误', content: '请等待当前图片生成完成' })
                } else if (image.star) {
                  dialogAction({ type: 'open', title: '错误', content: '请先取消收藏再删除' })
                } else {
                  let modifiedImages = cloneDeep(images)
                  modifiedImages = modifiedImages.filter(item => item.hash !== image.hash)
                  setImages(modifiedImages)
                }
            }}><DeleteOutlined /></button>

          </div>

        </div>
      }
    </SwiperSlide>
  )
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
  // 返回 JSX
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