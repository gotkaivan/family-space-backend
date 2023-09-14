import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
const fs = require('fs')

import * as cookieParser from 'cookie-parser'

const getHttpsOptions = () => {
  try {
    return {
      httpsOptions: {
        key: fs.readFileSync(process.env.HTTPS_KEY),
        cert: fs.readFileSync(process.env.HTTPS_CRT),
      },
    }
  } catch (e) {
    console.log('Не удалось получить ssh ключи')
    return {}
  }
}

async function bootstrap() {
  const PORT = process.env.PORT || 7000
  const app = await NestFactory.create(AppModule, getHttpsOptions())

  app.use(cookieParser())

  app.setGlobalPrefix('/api')

  app.enableCors({
    origin: ['http://localhost:3000', 'https://fincome.space'],
    credentials: true,
  })

  const config = new DocumentBuilder()
    .setTitle('Семейное приложение')
    .setDescription('Документация REST API')
    .setVersion('1.0.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('docs', app, document)

  await app.listen(PORT, () => {
    console.log(`Sever is started on port ${PORT}`)
  })
}
bootstrap()
