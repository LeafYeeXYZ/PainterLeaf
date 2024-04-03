# 赛博画师小叶子
一个简单的图片生成网站，前端使用 `swiper` 和 `vite`, 基于原生 `CSS` 和 `JavaScript` 构建, [后端](https://github.com/LeafYeeXYZ/PainterLeafServer)使用 `Hono` 和 `Cloudflare Workers`, 通过 `Cloudflare AI` 和 `Hugging Face` 的免费 `API` 提供模型和算力

## 使用
### 设置
```javascript
// src/main.js
const SERVER = "https://your.server.domain" // 你的服务器地址
const INTRO = "xxx" // 给用户的提示词
```

### 运行
```bash
# 安装依赖
pnpm i
# 本地运行
pnpm dev
# 打包
pnpm build
```
