import type { Context } from 'hono'

/** 生成请求地址和请求选项 */
class PainterRequest {
  #cfReg = /^@cf\//
  #hfReg = /^@hf\//

  url: string
  options: {
    method: string
    headers: HeadersInit
    body: string
  }

  constructor(
    model: string,
    prompt: string,
    env: { [key: string]: string, CF_USER: string, CF_AI_API_KEY: string, HF_API_KEY: string },
    image: number[] | undefined
  ) {
    // 判断模型
    if (this.#cfReg.test(model)) {
      // Cloudflare
      this.url = `https://api.cloudflare.com/client/v4/accounts/${env.CF_USER}/ai/run/${model}`
      this.options = {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${env.CF_AI_API_KEY}`
        },
        body: JSON.stringify({ 
          image: image,
          prompt: prompt,
          negative_prompt: 'lowres, bad, text, error, missing, extra, fewer, cropped, jpeg artifacts, worst quality, bad quality, watermark, bad aesthetic, unfinished, chromatic aberration, scan, scan artifacts',
        })
      }
      // 针对 Cloudflare 的 FLUX.1 Schnell 模型的特殊处理
      if (model === '@cf/black-forest-labs/flux-1-schnell') {
        this.options.body = JSON.stringify({
          num_steps: 8,
          ...JSON.parse(this.options.body)
        })
      }
    } else if (this.#hfReg.test(model)) {
      // Hugging Face
      // this.url = `https://api-inference.huggingface.co/models/${model.replace(this.#hfReg, '')}`
      this.url = `https://router.huggingface.co/hf-inference/models/${model.replace(this.#hfReg, '')}`
      this.options = {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${env.HF_API_KEY}`
        },
        body: JSON.stringify({ 
          inputs: prompt, 
          // 下面两行可能没用
          prompt: prompt,
          negative_prompt: 'lowres, bad, text, error, missing, extra, fewer, cropped, jpeg artifacts, worst quality, bad quality, watermark, bad aesthetic, unfinished, chromatic aberration, scan, scan artifacts',
          // 等到模型可用
          // options: { wait_for_model: true }
        })
      }
    } else {
      throw new Error(`Unsupported model: ${model}`)
    }
  }
}

export async function painter_generate(c: Context): Promise<Response> {
  try {
    // 图片
    const data = await c.req.json()
    if (c.env.PAINTERLEAF_SERVER_PASSWORD && data.password !== c.env.PAINTERLEAF_SERVER_PASSWORD) {
      return new Response('Unauthorized - Invalid Server Password', { 
        status: 401,
        statusText: 'Unauthorized - Invalid Server Password'
      })
    }
    const image = data.image as number[] | undefined
    const model = data.model as string
    const prompt = data.prompt as string
    // 请求参数和请求地址
    const { options, url } = new PainterRequest(model, prompt, c.env, image)
    // 发送请求
    const response = await fetch(url, options)
    // 针对 Cloudflare 的 FLUX.1 Schnell 模型的特殊处理
    if (model === '@cf/black-forest-labs/flux-1-schnell') {
      const res = await response.json()
      const base64 = res.result.image as string
      const buffer = new Uint8Array(atob(base64).split('').map(c => c.charCodeAt(0)))
      return new Response(buffer, {
        status: response.status,
        headers: {
          'content-type': 'image/png',
        }
      })
    }
    // 返回结果
    return new Response(response.body, {
      status: response.status,
      headers: {
        'content-type': response.headers.get('content-type') ?? 'text/plain',
      }
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unkown Server Error'
    return new Response(message, { status: 500 })
  }
}