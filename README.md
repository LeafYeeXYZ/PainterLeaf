**[中文](README_ZH.md) | English**

# PainterLeaf
An AI image generation tool, supports Chinese and English (Chinese will automatically call the AI translation), adopts front-end and back-end separation design, the front-end can be deployed on static website hosting services such as `Cloudflare Pages`, `Vercel`, and the back-end is based on `Hono`, deployed on `Cloudflare Workers`, see [this project](https://github.com/LeafYeeXYZ/MyAPIs)

## Usage
### Modify src/config.json
```javascript
{
  "SERVER": "https://api.xxx.workers.dev", // Your server address
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
