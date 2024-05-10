import { Switch, ConfigProvider } from 'antd'

interface LangSwitcherProps {
  setLangMode: React.Dispatch<React.SetStateAction<'zh' | 'en'>>
}

function LangSwitcher({ setLangMode }: LangSwitcherProps) {

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
        className='lang-switcher' 
        checkedChildren='英文提示词'
        unCheckedChildren='中文提示词'
        defaultChecked 
        onChange={checked => setLangMode(checked ? 'en' : 'zh')}
      />
    </ConfigProvider>
  )
}

export default LangSwitcher