**For old version, see `v3` branch.**

# Painter Leaf

- Text-to-image: supports multiple models
- Image-to-text: convert local images to prompts
- Prompt supports Chinese and English (Chinese will automatically call `AI` translation)
- `API` provided by `CloudflareAI` and `HuggingFace`

## TODO

- [ ] Implement `Image-to-text` feature
- [ ] Add preview images to `README.md`

## Usage

### Config Environment Variables

Set following environment variables in `.env` file or `Vercel`:

| Key | Value | Required |
| :---: | :---: | :---: |
| `CF_USER_ID` | `Cloudflare` user id | ✅ |
| `CF_AI_API_KEY` | `Cloudflare AI` api key | ✅ |
| `HF_API_KEY` | `HuggingFace` api key |  |

> If you don't need specific provider, you can leave the key empty.

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

It's recommended to deploy to `Vercel` while you can also deploy to other platforms, just make sure to set the environment variables correctly.
