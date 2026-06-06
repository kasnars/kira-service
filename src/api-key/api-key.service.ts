import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from 'crypto';
import { ApiKey } from './api-key.entity';
import { ApiProvider } from '../api-provider/api-provider.entity';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectRepository(ApiKey)
    private readonly apiKeyRepo: Repository<ApiKey>,
    @InjectRepository(ApiProvider)
    private readonly providerRepo: Repository<ApiProvider>,
    private readonly configService: ConfigService,
  ) {}

  private encrypt(text: string): string {
    const secret = this.configService.get<string>('aes.secret') || '0809';
    const key = createHash('sha256').update(secret).digest();
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return Buffer.concat([iv, encrypted]).toString('base64');
  }

  private decrypt(encrypted: string): string {
    const secret = this.configService.get<string>('aes.secret') || '0809';
    const key = createHash('sha256').update(secret).digest();
    const buffer = Buffer.from(encrypted, 'base64');
    const iv = buffer.subarray(0, 16);
    const data = buffer.subarray(16);
    const decipher = createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(data);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
  }

  private async verifyProviderOwnership(providerId: number, userId: number) {
    const provider = await this.providerRepo.findOne({
      where: { id: providerId },
    });
    if (!provider) {
      throw new NotFoundException('供应商不存在');
    }
    if (provider.user_id !== userId) {
      throw new ForbiddenException('无权操作该供应商');
    }
    return provider;
  }

  private async verifyKeyOwnership(keyId: number, userId: number) {
    const apiKey = await this.apiKeyRepo.findOne({
      where: { id: keyId },
      relations: { provider: true },
    });
    if (!apiKey) {
      throw new NotFoundException('API Key 不存在');
    }
    if (apiKey.provider.user_id !== userId) {
      throw new ForbiddenException('无权操作该 API Key');
    }
    return apiKey;
  }

  async create(userId: number, dto: CreateApiKeyDto) {
    await this.verifyProviderOwnership(dto.provider_id, userId);

    const apiKey = this.apiKeyRepo.create({
      provider_id: dto.provider_id,
      name: dto.name,
      key: this.encrypt(dto.key),
    });
    const saved = await this.apiKeyRepo.save(apiKey);
    return { ...saved, key: dto.key };
  }

  async findAllByProvider(providerId: number, userId: number) {
    await this.verifyProviderOwnership(providerId, userId);

    const keys = await this.apiKeyRepo.find({
      where: { provider_id: providerId },
      order: { createdAt: 'DESC' },
    });
    return keys.map((k) => ({ ...k, key: this.decrypt(k.key) }));
  }

  async findOne(id: number, userId: number) {
    const apiKey = await this.verifyKeyOwnership(id, userId);
    return { ...apiKey, key: this.decrypt(apiKey.key) };
  }

  async update(id: number, userId: number, dto: UpdateApiKeyDto) {
    await this.verifyKeyOwnership(id, userId);

    if (dto.provider_id !== undefined) {
      await this.verifyProviderOwnership(dto.provider_id, userId);
    }

    const updateData: any = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.key !== undefined) updateData.key = this.encrypt(dto.key);
    if (dto.provider_id !== undefined) updateData.provider_id = dto.provider_id;

    await this.apiKeyRepo.update(id, updateData);
    return this.findOne(id, userId);
  }

  async remove(id: number, userId: number) {
    await this.verifyKeyOwnership(id, userId);
    await this.apiKeyRepo.delete(id);
    return { message: '删除成功' };
  }
}
