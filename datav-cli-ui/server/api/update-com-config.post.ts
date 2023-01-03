import fs from 'node:fs'

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const ret = {
    code: 0,
    message: '',
  }

  try {
    if (!fs.existsSync(body.path)) {
      throw new Error('文件不存在')
    }

    fs.writeFileSync(body.path, body.content)
  } catch (error) {
    ret.code = 1
    ret.message = error.message
  }

  return ret
})
