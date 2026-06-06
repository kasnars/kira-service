import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DictType } from './dict-type.entity';
import { DictItem } from './dict-item.entity';
import { CreateDictTypeDto } from './dto/create-dict-type.dto';
import { UpdateDictTypeDto } from './dto/update-dict-type.dto';
import { CreateDictItemDto } from './dto/create-dict-item.dto';
import { UpdateDictItemDto } from './dto/update-dict-item.dto';

@Injectable()
export class DictService {
  constructor(
    @InjectRepository(DictType)
    private readonly typeRepo: Repository<DictType>,
    @InjectRepository(DictItem)
    private readonly itemRepo: Repository<DictItem>,
  ) {}

  async createType(dto: CreateDictTypeDto) {
    const existing = await this.typeRepo.findOne({ where: { name: dto.name } });
    if (existing) {
      throw new ConflictException('字典类型标识已存在');
    }
    const type = this.typeRepo.create(dto);
    return this.typeRepo.save(type);
  }

  async findAllTypes() {
    return this.typeRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findTypeById(id: number) {
    const type = await this.typeRepo.findOne({
      where: { id },
      relations: { items: true },
    });
    if (!type) {
      throw new NotFoundException('字典类型不存在');
    }
    type.items.sort((a, b) => a.sort - b.sort);
    return type;
  }

  async findTypeByName(name: string) {
    const type = await this.typeRepo.findOne({
      where: { name },
      relations: { items: true },
    });
    if (!type) {
      throw new NotFoundException('字典类型不存在');
    }
    type.items = type.items
      .filter((item) => item.status === 1)
      .sort((a, b) => a.sort - b.sort);
    return type;
  }

  async updateType(id: number, dto: UpdateDictTypeDto) {
    const type = await this.typeRepo.findOne({ where: { id } });
    if (!type) {
      throw new NotFoundException('字典类型不存在');
    }
    if (dto.name && dto.name !== type.name) {
      const existing = await this.typeRepo.findOne({
        where: { name: dto.name },
      });
      if (existing) {
        throw new ConflictException('字典类型标识已存在');
      }
    }
    await this.typeRepo.update(id, dto);
    return this.findTypeById(id);
  }

  async removeType(id: number) {
    const type = await this.typeRepo.findOne({ where: { id } });
    if (!type) {
      throw new NotFoundException('字典类型不存在');
    }
    await this.typeRepo.delete(id);
    return { message: '删除成功' };
  }

  async createItem(dto: CreateDictItemDto) {
    const type = await this.typeRepo.findOne({ where: { id: dto.type_id } });
    if (!type) {
      throw new NotFoundException('字典类型不存在');
    }
    const item = this.itemRepo.create(dto);
    return this.itemRepo.save(item);
  }

  async findItemsByTypeId(typeId: number) {
    return this.itemRepo.find({
      where: { type_id: typeId },
      order: { sort: 'ASC', id: 'ASC' },
    });
  }

  async findItemsByTypeName(typeName: string) {
    const type = await this.typeRepo.findOne({ where: { name: typeName } });
    if (!type) {
      throw new NotFoundException('字典类型不存在');
    }
    return this.itemRepo.find({
      where: { type_id: type.id, status: 1 },
      order: { sort: 'ASC', id: 'ASC' },
    });
  }

  async updateItem(id: number, dto: UpdateDictItemDto) {
    const item = await this.itemRepo.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('字典项不存在');
    }
    if (dto.type_id) {
      const type = await this.typeRepo.findOne({ where: { id: dto.type_id } });
      if (!type) {
        throw new NotFoundException('字典类型不存在');
      }
    }
    await this.itemRepo.update(id, dto);
    return this.itemRepo.findOne({ where: { id } });
  }

  async removeItem(id: number) {
    const item = await this.itemRepo.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('字典项不存在');
    }
    await this.itemRepo.delete(id);
    return { message: '删除成功' };
  }
}
