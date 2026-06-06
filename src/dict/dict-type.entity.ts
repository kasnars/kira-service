import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { DictItem } from './dict-item.entity';

@Entity('dict_types')
export class DictType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  label: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 1 })
  status: number;

  @OneToMany(() => DictItem, (item) => item.type)
  items: DictItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
