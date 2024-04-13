import { Switch, ConfigProvider } from 'antd'
import PropTypes from 'prop-types'
import '../styles/LangSwitcher.css'

function LangSwitcher({ setZhMode }) {
  const handleChange = checked => {
    setZhMode(!checked)
  } 

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#F18F01', /* 亮色背景颜色 */
          colorPrimaryHover: '#D16F00', /* 亮色背景颜色 (hover) */
          colorTextQuaternary: '#D16F00', /* 暗色背景颜色 */
          colorTextTertiary: '#D16F00', /* 暗色背景颜色 (hover) */
        },
        components: {
          Switch: {
            handleBg: '#FFD700',
          },
        },
      }}
    >
      <Switch
        className='lang-switcher' 
        checkedChildren='英文提示词'
        unCheckedChildren='中文提示词'
        defaultChecked 
        onChange={handleChange}
      />
    </ConfigProvider>
  )
}

LangSwitcher.propTypes = {
  setZhMode: PropTypes.func.isRequired,
}

export default LangSwitcher