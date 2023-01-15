import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true  // ? It will remove the unwanted fields
    })
  );
  await app.listen(5000, () => {
    console.log(`Server is Running at port 5000..`);
  });
}
bootstrap();
