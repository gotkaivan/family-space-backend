import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
const fs = require('fs')

import * as cookieParser from 'cookie-parser'

const httpsOptions = {
  key: fs.readFileSync('/var/www/httpd-cert/api-fincome.space_2023-09-06-11-25_07.key'),
  cert: fs.readFileSync('/var/www/httpd-cert/api-fincome.space_2023-09-06-11-25_07.crt'),
}

async function bootstrap() {
  const PORT = process.env.PORT || 7000
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  })

  app.use(cookieParser())

  app.setGlobalPrefix('/api')

  app.enableCors()

  const config = new DocumentBuilder()
    .setTitle('Семейное приложение')
    .setDescription('Документация REST API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)

  // console.log(document)
  SwaggerModule.setup('docs', app, document)

  await app.listen(PORT, () => {
    console.log(`Sever is started on port ${PORT}`)
  })
}
bootstrap()
