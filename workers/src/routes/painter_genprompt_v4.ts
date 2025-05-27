import type { Context } from 'hono'

export async function painter_genprompt_v4(c: Context): Promise<Response> {
  try {
    // 请求参数
    const url = `https://api.cloudflare.com/client/v4/accounts/${c.env.CF_USER}/ai/run/@cf/meta/llama-3.2-11b-vision-instruct`
    const req = await c.req.json()
    if (c.env.PAINTERLEAF_SERVER_PASSWORD && req.password !== c.env.PAINTERLEAF_SERVER_PASSWORD) {
      return new Response('Unauthorized - Invalid Server Password', { 
        status: 401,
        statusText: 'Unauthorized - Invalid Server Password'
      })
    }
    const body = {
      image: req.image,
      max_tokens: 4096,
      prompt: 'Analyze the given image and provide a detailed (but less than 8 sentences) description. Include details about the main subject/people/characters, background, colors, composition, and mood. Ensure the description is vivid and suitable for input into a text-to-image generation model (which means it should be in only one paragraph and not contain any bullet points or lists).',
    }
    // 发送请求
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${c.env.CF_AI_API_KEY}`
      },
      body: JSON.stringify(body)
    })
    const result = await response.json()
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 500,
      headers: {
        'content-type': 'application/json',
      }
    })
  } catch(e) {
    const message = e instanceof Error ? e.message : 'Unkown Server Error'
    return new Response(message, { status: 500 })
  }
}