**中文 | [English](README.md)**

# 赛博画师小叶子
一个 `AI` 图片生成工具, 支持中英双语 (中文将自动调用 `AI` 翻译), 采用前后端分离设计, 前端基于 `React` 框架, 可部署在 `Cloudflare Pages`, `Vercel` 等静态网站托管服务上, 后端基于 `Hono`, 部署在 `Cloudflare Workers`, 见[这个项目](https://github.com/LeafYeeXYZ/MyAPIs)

## 使用方法
### 修改配置
```javascript
// 修改 src/config.json
{
  "SERVER": "https://api.xxx.workers.dev", // 你的服务器地址
}
```

### 安装依赖
```bash
npm i -g pnpm
pnpm i
```

### 本地运行
```bash
pnpm dev
```

### 打包
```bash
pnpm build
```