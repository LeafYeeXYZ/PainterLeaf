import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { get, update } from 'idb-keyval'

// 这下应该只有这个组件涉及到 createObjectURL 和 revokeObjectURL 了
export default function Img({ blob, className, hash }) {
  const [objectURL, setObjectURL] = useState('')
  useEffect(() => {
    get('cachedImages').then(cachedImages => {
      /** 
       * 存在 IndexedDB 中的缓存图片
       * @type {Object<hash: string, Object<blob: Blob, url: string>>} 
       */
      const cache = cachedImages && cachedImages[hash]
      if (typeof cache === 'object' && cache.url) {
        setObjectURL(cache.url)
      } else {
        const url = URL.createObjectURL(blob)
        setObjectURL(url)
        update('cachedImages', images => {
          images[hash] = { blob, url }
          return images
        })
      }
      return () => {
        if (objectURL) {
          URL.revokeObjectURL(objectURL)
        }
      }
    })
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