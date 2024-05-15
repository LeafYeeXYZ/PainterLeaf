import { useRef, useContext, useState, useEffect } from "react"
import type { DialogAction } from "../../libs/useDialog"
import { LangContext } from "../../lang"

interface ImageSelectorProps {
  ref: React.RefObject<HTMLInputElement>
  geneMode: 'textToImage' | 'imageToImage'
  dialogAction: React.Dispatch<DialogAction>
}

function ImageSelector({ ref, geneMode, dialogAction }: ImageSelectorProps) {

  const filename = useRef<HTMLDivElement>(null)
  const t = useContext(LangContext)

  // 計算寬度: 100% - 提示詞長度 - 文生圖/圖生圖長度
  const [width, setWidth] = useState<string>('fit-content')
  useEffect(() => {
    const callback = () => {
      const langWidth = document.querySelector('.lang-switcher')!.clientWidth ?? 0
      const modeWidth = document.querySelector('.mode-switcher')!.clientWidth ?? 0
      setWidth(`calc(100% - ${langWidth.toString()}px - ${modeWidth.toString()}px - 18px)`)
    }
    callback()
    // 防抖处理
    let timer: number
    const newCallback = () => {
      clearTimeout(timer)
      timer = setTimeout(callback, 200)
    }
    window.addEventListener('resize', newCallback)
    return () => window.removeEventListener('resize', newCallback)
  }, [])

  return (   
    <div 
      className='image-selector-container'
      style={{ width }}
    >
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
          if (file.size > 5 * 1024 * 1024) {
            dialogAction({
              type: 'open',
              title: t.imageTooBig,
              content: t.imageTooBigInfo(5),
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
        {t.chooseImage}
      </label>
      <p 
        className='image-selector-filename'
        ref={filename}
      ></p>
    </div>
  )
}

export default ImageSelector