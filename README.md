**For old version, see `v3` branch and <https://paint.leafyee.xyz>**

# Painter Leaf

- Text-to-image: supports multiple models
- Image-to-text: convert local images to prompts
- Prompt supports Chinese and English (Chinese will automatically call `AI` translation)
- `API` provided by `CloudflareAI` and `HuggingFace`

| ![](./readme/1.jpg) | ![](./readme/2.jpg) | ![](./readme/3.jpg) |
| :---: | :---: | :---: |

## Usage

### Config Environment Variables

Set following environment variables in `.env` file, `Vercel`, `Deno Deploy`, etc.

| Key | Value | Required |
| :---: | :---: | :---: |
| `CF_USER_ID` | `Cloudflare` user id | ✅ |
| `CF_AI_API_KEY` | `Cloudflare AI` api key | ✅ |
| `HF_API_KEY` | `HuggingFace` api key |  |

> **Optional**: You can still use `v3` client-server mode without setting variables above, see [this project](https://github.com/LeafYeeXYZ/MyAPIs). After deploying the server, set `NEXT_PUBLIC_WORKERS_SERVER` environment variable (e.g. `https://api.xxx.workers.dev`, without `/`). This is useful when you frequently exceed the `Vercel` timeout limit.

### Install dependencies

```bash
bun i
```

> If you haven't installed `Bun` yet, please refer to [Bun.sh](https://bun.sh).

### Local Development

```bash
bun dev
```

### Deploy

If you are using `Vercel`, be aware of the `Vercel` requset timeout limit (10s). You can either subscribe to a paid plan or run the server locally.

## Common Issues

- `429` error in your browser console: You may have exceeded the `HuggingFace` api request limit. Please wait for a while, reduce the frequency of requests, and consider subscribing to a paid plan.
- `504` error in your browser console: The request have exceeded the `Vercel` timeout limit. Please consider subscribing to a paid plan or run the server locally.
