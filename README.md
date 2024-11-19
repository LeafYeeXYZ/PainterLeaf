**For old version, see `v3` branch.**

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

If you are using `Vercel`, be aware of the `Vercel` requset timeout limit (you may need a pro plan).

I'm using `Deno Deploy` for this project, see <deno.com>.
