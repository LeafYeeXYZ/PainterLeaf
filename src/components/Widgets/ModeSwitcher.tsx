import { Switch, ConfigProvider } from 'antd'

interface ModeSwitcherProps {
  setMode: (mode: 'textToImage' | 'imageToImage') => void
}

function ModeSwitcher({ setMode }: ModeSwitcherProps) {
  const handleChange: (checked: boolean) => void = checked => {
    setMode(checked ? 'textToImage' : 'imageToImage')
  } 

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
        checkedChildren='文生图模式'
        unCheckedChildren='图生图模式'
        defaultChecked 
        onChange={handleChange}
      />
    </ConfigProvider>
  )
}

export default ModeSwitcher