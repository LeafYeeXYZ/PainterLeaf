import { Switch, ConfigProvider } from 'antd'
import { useContext } from 'react'
import { LangContext } from '../../lang'

interface ModeSwitcherProps {
  setGeneMode: React.Dispatch<React.SetStateAction<'textToImage' | 'imageToImage'>>
}

function ModeSwitcher({ setGeneMode }: ModeSwitcherProps) {

  const t = useContext(LangContext)

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#ff7171', /* 亮色背景颜色 */
          colorPrimaryHover: '#ff4f4f', /* 亮色背景颜色 (hover) */
          colorTextQuaternary: '#ff7171', /* 暗色背景颜色 */
          colorTextTertiary: '#ff4f4f', /* 暗色背景颜色 (hover) */
        },
        components: {
          Switch: {
            handleBg: '#ffe1e1',
          },
        },
      }}
    >
      <Switch
        className='mode-switcher' 
        checkedChildren={t.textToImage}
        unCheckedChildren={t.imageToImage}
        defaultChecked 
        onChange={checked => setGeneMode(checked ? 'textToImage' : 'imageToImage')}
      />
    </ConfigProvider>
  )
}

export default ModeSwitcher