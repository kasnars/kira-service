import { PartialType } from '@nestjs/swagger';
import { CreateApiProviderDto } from './create-api-provider.dto';

export class UpdateApiProviderDto extends PartialType(CreateApiProviderDto) {}
