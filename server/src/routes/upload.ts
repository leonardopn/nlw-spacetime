import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { createWriteStream } from 'fs'
import { extname, resolve } from 'path'
import { pipeline } from 'stream'
import { promisify } from 'util'

const pump = promisify(pipeline)

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload', async (request, reply) => {
    const upload = await request.file({
      limits: {
        fileSize: 5_242_880, // 5MB
      },
    })

    if (!upload) {
      return reply.status(400).send()
    }
    const mimeTypeReges = /^(image|video)\/[a-zA-Z]+/
    const isValidFileFormat = mimeTypeReges.test(upload.mimetype)

    if (!isValidFileFormat) {
      return reply.status(400).send()
    }

    const fileId = randomUUID()

    const extension = extname(upload.filename)

    const fileName = `${fileId}${extension}`

    const writeStream = createWriteStream(
      resolve(__dirname, '../../uploads/', fileName),
    )

    await pump(upload.file, writeStream)

    const fullUrl = `${request.protocol}://${request.hostname}`
    const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString()

    return { ok: fileUrl }
  })
}
