import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiProvider } from './api-provider.entity';
import { ApiProviderController } from './api-provider.controller';
import { ApiProviderService } from './api-provider.service';

@Module({
  imports: [TypeOrmModule.forFeature([ApiProvider])],
  controllers: [ApiProviderController],
  providers: [ApiProviderService],
  exports: [ApiProviderService],
})
export class ApiProviderModule {}
