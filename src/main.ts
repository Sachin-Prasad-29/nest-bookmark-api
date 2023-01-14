import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(5000, () => {
    console.log(`Server is Running at port 5000..`);
  });
}
bootstrap();
