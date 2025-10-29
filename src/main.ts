import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Concert App API')
    .setDescription('API documentation for Concert Reservation System')
    .setVersion('1.0')
    .addTag('concert', 'Concert management endpoints')
    .addTag('reservation', 'Reservation management endpoints')
    .addTag('dashboard', 'Dashboard endpoints')
    .addTag('user', 'User management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
