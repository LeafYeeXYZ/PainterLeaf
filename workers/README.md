## Usage

### Configure Environment Variables

Please manually create the `wrangler.toml` file, and add the following content:

```toml
name = "api"
main = "dist/index.js"
compatibility_date = "2024-04-05"

[vars]
KEY = "VALUE"
# See Environment Variables

[observability] # Optional
enabled = true # Optional
```

### Environment Variables

- `CF_USER`: `Cloudflare` user `ID`
- `CF_AI_API_KEY`: `Cloudflare AI` `API` key
- `HF_API_KEY`: `Hugging Face` `API` key
- `PAINTERLEAF_SERVER_PASSWORD`: `PainterLeaf` server password

### Deployment

```bash
# Install dependencies
npm i -g bun # if you haven't installed bun yet
bun i
# Login to Cloudflare
bunx wrangler login
# Deploy
bun dep
```

## API Reference

| Function | Path | Method | Query Parameters | Request Body | Response |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Generate image | `/painter/generate` | `POST` | - | `prompt`: prompt words<br>`model`: model name<br>If img2img: `image: Array.from(uint8Array)` | `image/png` |
| Translate prompt words | `/painter/translate` | `POST` | - | `text`: text<br>`source_lang`: source language<br>`target_lang`: target language | `application/json` |
| Generate text from image<br />with `llama3.2 vision` | `/painter/genprompt/v4` | `POST` | - | `image: Array.from(uint8Array)` | `application/json` |
