import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

import * as cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common'
// somewhere in your initialization file

async function bootstrap() {
  const PORT = process.env.PORT || 7000
  const app = await NestFactory.create(AppModule)

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
