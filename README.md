**[中文](README_ZH.md) | English**

# PainterLeaf
An AI image generation tool written in native `JavaScript`, adopting a front-end and back-end separation design. The front-end can be deployed on static website hosting services such as `Cloudflare Pages`, `Vercel`, etc., and the back-end is deployed on `Cloudflare Workers` based on `Hono`, see [this project](https://github.com/LeafYeeXYZ/PainterLeafServer)

## Usage
### Modify src/config.json
```javascript
{
  "SERVER": "https://xxx.workers.dev", // Your server address
  "INTRO": "xxxxxx<br>xxxxxxx", // Website introduction
}
```

### Install dependencies
```bash
npm i -g pnpm
pnpm i
```

### Local run
```bash
pnpm dev
```

### Build
```bash
pnpm build
```
