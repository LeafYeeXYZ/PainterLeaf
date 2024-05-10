import { useRef } from "react"
import type { DialogAction } from "../../libs/useDialog"

interface ImageSelectorProps {
  ref: React.RefObject<HTMLInputElement>
  geneMode: 'textToImage' | 'imageToImage'
  dialogAction: React.Dispatch<DialogAction>
}

function ImageSelector({ ref, geneMode, dialogAction }: ImageSelectorProps) {

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
          if (!event.target.files) return
          const file = event.target.files[0]
          // 限制图片大小
          if (file.size > 10 * 1024 * 1024) {
            dialogAction({
              type: 'open',
              title: '图片过大',
              content: '请选择小于 10MB 的图片',
            })
            event.target.value = ''
            return
          }
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