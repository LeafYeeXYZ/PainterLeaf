**For old version, see `v3` branch and <https://paint.leafyee.xyz>**

# Painter Leaf

- Text-to-image: supports multiple models
- Image-to-text: convert local images to prompts
- Prompt supports Chinese and English (Chinese will automatically call `AI` translation)
- `API` provided by `CloudflareAI` and `HuggingFace`

## TODO

- [ ] Implement `Image-to-text` feature
- [ ] Implement Dark Mode
- [ ] Add preview images to `README.md`

## Usage

### Config Environment Variables

Set following environment variables in `.env` file, `Vercel`, `Deno Deploy`, etc.

| Key | Value | Required |
| :---: | :---: | :---: |
| `CF_USER_ID` | `Cloudflare` user id | ✅ |
| `CF_AI_API_KEY` | `Cloudflare AI` api key | ✅ |
| `HF_API_KEY` | `HuggingFace` api key |  |

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

If you are using `Vercel`, be aware of the `Vercel` requset timeout limit (10s). You can either locally run the server or subscribe to a paid plan.

## Common Issues

- `429` error in your browser console: You may have exceeded the `HuggingFace` api request limit. Please wait for a while, reduce the frequency of requests, and consider subscribing to a paid plan.
- `504` error in your browser console: The request have exceeded the `Vercel` timeout limit. Please consider subscribing to a paid plan or run the server locally.
