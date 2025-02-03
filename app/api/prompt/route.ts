export async function POST(req: Request): Promise<Response> {
  try {
    const { image } = await req.json()
    const url = `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_USER_ID}/ai/run/@cf/meta/llama-3.2-11b-vision-instruct`
    const body = {
      image: image as number[],
      max_tokens: 4096,
      prompt: 'Analyze the given image and provide a detailed (but less than 8 sentences) description. Include details about the main subject/people/characters, background, colors, composition, and mood. Ensure the description is vivid and suitable for input into a text-to-image generation model (which means it should be in only one paragraph and not contain any bullet points or lists).',
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
