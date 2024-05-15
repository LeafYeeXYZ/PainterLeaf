**[简体中文](README_ZH.md) | 正體中文 | [English](README.md)**

# PainterLeaf
- 文生圖, 支持多種模型
- 圖生文, 將本地圖片轉為提示詞
- 也支持圖生圖
- 提示詞支持中英雙語 (中文將自動調用 `AI` 翻譯)
- 前後端分離, 前端基於 `React`, 後端基於 `Hono`, 見[這個項目](https://github.com/LeafYeeXYZ/MyAPIs)
- 使用 `CloudflareAI` 和 `HuggingFace` 提供的 `API`
- 國際化支持, 目前支持 `簡體中文`, `正體中文`, `英文`

|![](./readme/light.png)|![](./readme/dark.png)|
|:---:|:---:|

## 示例
|![](./readme/example2.png)|![](./readme/example3.png)|![](./readme/example4.png)|
|:---:|:---:|:---:|

## 使用方法
### 部署伺服器
見[這個項目](https://github.com/LeafYeeXYZ/MyAPIs)

### 修改配置
```javascript
// 修改 src/config.json
{
  "SERVER": "https://api.xxx.workers.dev", // 你的伺服器地址
}
```

### 安裝依賴
```bash
npm i -g pnpm
pnpm i
```

### 本地運行
```bash
pnpm dev
```

### 打包
```bash
pnpm build
```
