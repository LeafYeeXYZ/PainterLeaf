export async function POST(req: Request): Promise<Response> {
  try {
    const { image } = await req.json()
    const url = `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_USER_ID}/ai/run/@cf/unum/uform-gen2-qwen-500m`
    const body = {
      image: image,
      max_tokens: 2048,
      prompt: 'Generate a detailed description in a single paragraph for this image',
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${process.env.CF_AI_API_KEY}`
      },
      body: JSON.stringify(body)
    })
    const result = await response.json()
    return Response.json(result)
  } catch {
    return new Response('Failed to generate prompt', { status: 500 })
  }
}
