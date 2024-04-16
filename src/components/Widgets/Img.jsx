import PropTypes from 'prop-types'

export default function Img ({ blob, className, hash }) {
  // 只有这个组件涉及到 createObjectURL 和 revokeObjectURL
  const cache = sessionStorage.getItem(hash)
  let src = ''
  if (cache) {
    fetch(cache)
    .then(oldBlob => {
      if (oldBlob.size < 4096) {
        src = URL.createObjectURL(blob)
        sessionStorage.setItem(hash, src)
        return <img src={src} className={className} />
      } else {
        src = cache
        return <img src={src} className={className} />
      }
    })
    .catch(() => {
      src = URL.createObjectURL(blob)
      sessionStorage.setItem(hash, src)
      return <img src={src} className={className} />
    })
  } else {
    src = URL.createObjectURL(blob)
    sessionStorage.setItem(hash, src)
    return <img src={src} className={className} />
  }
}

Img.propTypes = {
  blob: PropTypes.instanceOf(Blob).isRequired,
  className: PropTypes.string,
  hash: PropTypes.string.isRequired,
}