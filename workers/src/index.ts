import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { painter_generate } from './routes/painter_generate'
import { painter_translate } from './routes/painter_translate'
import { painter_genprompt_v4 } from './routes/painter_genprompt_v4'

const app = new Hono()

app.use('*', cors())
app.post('/painter/generate', painter_generate)
app.post('/painter/translate', painter_translate)
app.post('/painter/genprompt/v4', painter_genprompt_v4)
app.all('*', () => new Response('请求路径错误 / Not Found', { status: 404 }))

export default app
