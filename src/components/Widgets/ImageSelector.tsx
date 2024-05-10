import { useRef } from "react"

interface ImageSelectorProps {
  ref: React.RefObject<HTMLInputElement>
  geneMode: 'textToImage' | 'imageToImage'
}

function ImageSelector({ ref, geneMode }: ImageSelectorProps) {

  const filename = useRef<HTMLDivElement>(null)

  return (
    <div className='image-selector-container'>
      <input 
        ref={ref}
        type='file'
        accept='image/jpeg, image/png'
        className='image-selector'
        id="image-selector"
        name="image-selector"
        disabled={geneMode === 'textToImage'}
        onChange={event => {
          const file = event.target.files![0]
          filename.current!.textContent = file.name
        }}
      />
      <label 
        htmlFor="image-selector"
        className='image-selector-label'
      >
        选择图片
      </label>
      <p 
        className='image-selector-filename'
        ref={filename}
      ></p>
    </div>
  )
}

export default ImageSelector