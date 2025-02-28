export async function POST(req: Request): Promise<Response> {
  try {
    const url = `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_USER_ID}/ai/run/@cf/meta/m2m100-1.2b`
    const { zh } = await req.json()
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${process.env.CF_AI_API_KEY}`,
      },
      body: JSON.stringify({
        text: zh,
        source_lang: 'zh',
        target_lang: 'en',
      }),
    })
    const result = await res.json()
    if (result?.success) {
      return Response.json(result)
    } else {
      return new Response('Translate Failed', { status: 500 })
    }
  } catch (e) {
    return new Response(
      e instanceof Error ? e.message : 'Unkown Server Error',
      { status: 500 },
    )
  }
}
