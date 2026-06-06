import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DictType } from './dict-type.entity';

@Entity('dict_items')
export class DictItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type_id: number;

  @Column()
  label: string;

  @Column()
  value: string;

  @Column({ default: 0 })
  sort: number;

  @Column({ default: 1 })
  status: number;

  @Column({ nullable: true })
  remark: string;

  @ManyToOne(() => DictType, (type) => type.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'type_id' })
  type: DictType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
