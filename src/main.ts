import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
const fs = require('fs')

import * as cookieParser from 'cookie-parser'

const getHttpsOptions = () => {
  try {
    return {
      httpsOptions: {
        key: fs.readFileSync('/var/www/httpd-cert/api-fincome.space_2023-09-06-11-25_07.key'),
        cert: fs.readFileSync('/var/www/httpd-cert/api-fincome.space_2023-09-06-11-25_07.crt'),
      },
    }
  } catch (e) {
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
