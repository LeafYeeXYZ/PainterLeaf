**简体中文 | [正體中文](README_ZH_TW.md) | [English](README.md)**

# 赛博画师小叶子
- 文生图, 支持多种模型
- 图生文, 将本地图片转为提示词
- 也支持图生图
- 提示词支持中英双语 (中文将自动调用 `AI` 翻译)
- 前后端分离, 前端基于 `React`, 后端基于 `Hono`, 见[这个项目](https://github.com/LeafYeeXYZ/MyAPIs)
- 使用 `CloudflareAI` 和 `HuggingFace` 提供的 `API`
- 国际化支持, 目前支持 `简体中文`, `繁体中文`, `英文`

|![](./readme/mobile-light.jpeg)|![](./readme/mobile-dark.jpeg)|
|:---:|:---:|
|![](./readme/light.png)|![](./readme/dark.png)|

## 使用方法
### 部署服务器
见[这个项目](https://github.com/LeafYeeXYZ/MyAPIs)

### 设置服务器地址
在 `.env` 文件, `Vercel` 或 `Cloudflare Pages` 中设置 `VITE_SERVER` 环境变量, 如 `https://api.xxx.workers.dev`

### 安装 Bun
请参考 [Bun.sh](https://bun.sh). 或直接运行 `npm i -g bun`

### 安装依赖
```bash
bun i
```

### 本地运行
```bash
bun run dev
```

### 打包
```bash
bun run build
```