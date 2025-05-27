import type { Context } from 'hono'

export async function painter_translate(c: Context): Promise<Response> {
  try {
    // 请求参数
    const url = `https://api.cloudflare.com/client/v4/accounts/${c.env.CF_USER}/ai/run/@cf/meta/m2m100-1.2b`
    const body = await c.req.json()
    if (
      c.env.PAINTERLEAF_SERVER_PASSWORD &&
      body.password !== c.env.PAINTERLEAF_SERVER_PASSWORD
    ) {
      return new Response('Unauthorized - Invalid Server Password', {
        status: 401,
        statusText: 'Unauthorized - Invalid Server Password',
      })
    }
    // 发送请求
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${c.env.CF_AI_API_KEY}`,
      },
      body: JSON.stringify(body),
    })
    const result = await response.json()
    // 返回结果
    if (result.success) {
      return new Response(JSON.stringify(result), {
        headers: {
          'content-type': 'application/json',
        },
      })
    } else {
      return new Response('翻译失败', { status: 500 })
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unkown Server Error'
    return new Response(message, { status: 500 })
  }
}
