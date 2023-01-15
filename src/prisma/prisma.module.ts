import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // * this is the global Export  of service module
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule {}
