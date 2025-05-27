import type { Context } from 'hono'
import { InferenceClient } from '@huggingface/inference'

async function getImageFromHuggingFace(
  model: string,
  prompt: string,
  env: { HF_API_KEY: string },
): Promise<Response> {
  const client = new InferenceClient(env.HF_API_KEY)
  const image = (await client.textToImage(
    {
      provider: 'auto',
      model: model.replace(/^@hf\//, ''), // 移除 @hf/ 前缀
      inputs: prompt,
    },
    { outputType: 'blob' },
  )) as Blob
  return new Response(image, {
    status: 200,
    headers: {
      'content-type': 'image/png',
    },
  })
}

async function getImageFromCloudflare(
  model: string,
  prompt: string,
  env: { CF_USER_ID: string; CF_AI_API_KEY: string },
): Promise<Response> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${env.CF_USER_ID}/ai/run/${model}`
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${env.CF_AI_API_KEY}`,
    },
    body: JSON.stringify({
      prompt: prompt,
      negative_prompt:
        'lowres, bad, text, error, missing, extra, fewer, cropped, jpeg artifacts, worst quality, bad quality, watermark, bad aesthetic, unfinished, chromatic aberration, scan, scan artifacts',
    }),
  }
  // 针对 Cloudflare 的 FLUX.1 Schnell 模型的特殊处理
  if (model === '@cf/black-forest-labs/flux-1-schnell') {
    options.body = JSON.stringify({
      num_steps: 8,
      ...JSON.parse(options.body),
    })
  }
  const response = await fetch(url, options)
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Cloudflare API Error: ${errorText}`)
  }
  // 针对 Cloudflare 的 FLUX.1 Schnell 模型的特殊处理
  if (model === '@cf/black-forest-labs/flux-1-schnell') {
    const res = await response.json()
    const base64 = res.result.image as string
    const buffer = new Uint8Array(
      atob(base64)
        .split('')
        .map((c) => c.charCodeAt(0)),
    )
    return new Response(buffer, {
      status: response.status,
      headers: {
        'content-type': 'image/png',
      },
    })
  }
  return new Response(response.body, {
    status: response.status,
    headers: {
      'content-type': response.headers.get('content-type') ?? 'text/plain',
    },
  })
}

export async function painter_generate(c: Context): Promise<Response> {
  try {
    const data = await c.req.json()
    if (
      c.env.PAINTERLEAF_SERVER_PASSWORD &&
      data.password !== c.env.PAINTERLEAF_SERVER_PASSWORD
    ) {
      return new Response('Unauthorized - Invalid Server Password', {
        status: 401,
        statusText: 'Unauthorized - Invalid Server Password',
      })
    }
    const cfReg = /^@cf\//
    const hfReg = /^@hf\//
    const model = data.model as string
    const prompt = data.prompt as string
    if (cfReg.test(model)) {
      const response = await getImageFromCloudflare(model, prompt, {
        CF_USER_ID: c.env.CF_USER_ID ?? '',
        CF_AI_API_KEY: c.env.CF_AI_API_KEY ?? '',
      })
      return response
    }
    if (hfReg.test(model)) {
      const response = await getImageFromHuggingFace(model, prompt, {
        HF_API_KEY: c.env.HF_API_KEY ?? '',
      })
      return response
    }
    return new Response('Unsupported model', {
      status: 400,
      statusText: 'Unsupported model',
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unkown Server Error'
    return new Response(message, { status: 500 })
  }
}
