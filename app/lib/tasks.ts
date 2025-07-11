import type { Image, Task } from './types'
import { getHash, getMaxGenerating, getBase64, getPassword } from './utils'
import type { SetAction } from './useZustand'

export async function handleTasks(
  tasks: Task[],
  setTasks: (action: SetAction<Task[]>) => void,
  setImages: (action: SetAction<Image[]>) => void,
  hasImage: (hash: string) => boolean,
): Promise<void> {
  const maxGenerating = getMaxGenerating()
  const tasksGenerating = tasks.filter(
    (task) => task.status === 'generating',
  ).length
  if (
    tasks.length === 0 ||
    tasksGenerating >= maxGenerating ||
    tasks.every((task) => task.status !== 'waiting')
  ) {
    return
  } else {
    const tasksToGenerate = tasks
      .filter((task) => task.status === 'waiting')
      .toReversed()
      .slice(0, maxGenerating - tasksGenerating)
    setTasks((prev) =>
      prev.map((t) =>
        tasksToGenerate.some(
          (task) => task.createTimestamp === t.createTimestamp,
        )
          ? { ...t, status: 'generating' }
          : t,
      ),
    )
    await Promise.all(
      tasksToGenerate.map(async (task) => {
        const { success, data } = await generateImage(task)
        if (success) {
          const hash = await getHash(data)
          if (hasImage(hash)) {
            setTasks((prev) =>
              prev.map((t) =>
                t.createTimestamp === task.createTimestamp
                  ? {
                      ...t,
                      status: 'error',
                      error:
                        'The server generated a duplicate image, please try a different prompt',
                    }
                  : t,
              ),
            )
            return
          }
          setImages((prev) => [
            {
              star: false,
              hash,
              data,
              prompt: `${task.trigger ? `${task.trigger}, ` : ''}${task.prompt}`,
              model: task.model,
            },
            ...prev,
          ])
          setTasks((prev) =>
            prev.map((t) =>
              t.createTimestamp === task.createTimestamp
                ? { ...t, status: 'success' }
                : t,
            ),
          )
        } else {
          setTasks((prev) =>
            prev.map((t) =>
              t.createTimestamp === task.createTimestamp
                ? { ...t, status: 'error', error: data }
                : t,
            ),
          )
        }
      }),
    )
  }
}

/** Return whether the task is successfully generated and either base64 data or error message */
async function generateImage(
  task: Task,
): Promise<{ success: boolean; data: string }> {
  const password = getPassword()
  const { prompt, model, promptLanguage, trigger } = task
  try {
    const promptEN = `${trigger ? `${trigger}, ` : ''}${promptLanguage === 'en' ? prompt : await translate(prompt)}`
    let res: Response | undefined
    if (process.env.NEXT_PUBLIC_WORKERS_SERVER) {
      res = await fetch(
        `${process.env.NEXT_PUBLIC_WORKERS_SERVER}/painter/generate`,
        {
          method: 'POST',
          body: JSON.stringify({
            prompt: promptEN,
            model,
            password,
          }),
        },
      )
    } else {
      res = await fetch('/api/image', {
        method: 'POST',
        body: JSON.stringify({
          prompt: promptEN,
          model,
          password,
        }),
      })
    }
    if (!res!.ok) {
      throw new Error(
        `Failed to generate the image, error: ${res!.status}${res!.statusText ? ` ${res!.statusText}` : ''}`,
      )
    }
    const data = await res!.blob()
    return { success: true, data: await getBase64(data) }
  } catch (e) {
    return {
      success: false,
      data: e instanceof Error ? e.message : 'Unknown error',
    }
  }
}

/** Return the translated prompt */
async function translate(prompt: string): Promise<string> {
  const password = getPassword()
  let res: Response | undefined
  if (process.env.NEXT_PUBLIC_WORKERS_SERVER) {
    res = await fetch(
      `${process.env.NEXT_PUBLIC_WORKERS_SERVER}/painter/translate`,
      {
        method: 'POST',
        body: JSON.stringify({
          text: prompt,
          source_lang: 'zh',
          target_lang: 'en',
          password,
        }),
      },
    )
  } else {
    res = await fetch('/api/translate', {
      method: 'POST',
      body: JSON.stringify({
        zh: prompt,
        password,
      }),
    })
  }
  if (!res!.ok) {
    throw new Error(
      `Failed to translate the prompt, error: ${res!.status}${res!.statusText ? ` ${res!.statusText}` : ''}`,
    )
  }
  const { result } = await res!.json()
  return result.translated_text
}
