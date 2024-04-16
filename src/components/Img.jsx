import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { setItem, getItem } from 'localforage'

export default function Img({ blob, className, hash }) {
  const [objectURL, setObjectURL] = useState('')
  useEffect(() => {
    getItem(hash).then(data => {
      if (data && data.size > 4096) {
        const url = URL.createObjectURL(blob)
        setObjectURL(url)
      } else {
        setItem(hash, blob)
        const url = URL.createObjectURL(blob)
        setObjectURL(url)
      }
    })
    return () => {
      if (objectURL) URL.revokeObjectURL(objectURL)
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