
// import type { Context } from 'hono'
// export async function painter_genprompt(c: Context): Promise<Response> {
//   try {
//     // 请求参数
//     const url = `https://api.cloudflare.com/client/v4/accounts/${c.env.CF_USER}/ai/run/@cf/unum/uform-gen2-qwen-500m`
//     const req = await c.req.json()
//     const body = {
//       image: req.image,
//       max_tokens: 2048,
//       prompt: 'Generate a detailed description in a single paragraph for this image',
//     }
//     // 发送请求
//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'content-type': 'application/json',
//         'Authorization': `Bearer ${c.env.CF_AI_API_KEY}`
//       },
//       body: JSON.stringify(body)
//     })
//     const result = await response.json()
//     // 返回结果
//     console.log(SUCCESS_MESSAGE)
//     return new Response(JSON.stringify(result), {
//       status: result.success ? 200 : 500,
//       headers: {
//         'content-type': 'application/json',
//       }
//     })
//   } catch(e) {
//     const message = e instanceof Error ? e.message : 'Unkown Server Error'
//     ERROR_MESSAGE.data!.error = message
//     console.error(ERROR_MESSAGE)
//     return new Response(message, { status: 500 })
//   }
// }