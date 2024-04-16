import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

export default function Img ({ blob, className, hash }) {
  // 只有这个组件涉及到 createObjectURL 和 revokeObjectURL
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