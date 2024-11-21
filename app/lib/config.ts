import type { ThemeConfig } from 'antd'
import { theme } from 'antd'

export type Model = {
  value: string
  label: string
}

export const Models: Model[] = [
  // 由于这个模型和 Cloudflare 的其他模型返回值不同, 故在 image/route.ts 中进行了两处特殊处理
  { value: '@cf/black-forest-labs/flux-1-schnell', label: '☁️ FLUX.1 Schnell' },
  { value: '@cf/stabilityai/stable-diffusion-xl-base-1.0', label: '☁️ SDXL Base' },
  { value: '@cf/bytedance/stable-diffusion-xl-lightning', label: '☁️ SDXL Lightning' },
  { value: '@hf/black-forest-labs/FLUX.1-dev', label: '🤗 FLUX.1 Dev' },
  { value: '@hf/stabilityai/stable-diffusion-3.5-large', label: '🤗 SD 3.5 Large' },
  { value: '@hf/stabilityai/stable-diffusion-3.5-large-turbo', label: '🤗 SD 3.5 Large Turbo' },
]

export const ANTD_THEME_LIGHT: ThemeConfig = {
  token: {
    colorPrimary: '#ff8080',
    colorText: '#4c0519',
  },
}

export const ANTD_THEME_DARK: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#ff8080',
    colorText: '#ffffff',
  },
}
