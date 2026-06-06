import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('operation_logs')
export class OperationLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  user_id: number;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  module: string;

  @Column({ nullable: true })
  action: string;

  @Column()
  method: string;

  @Column()
  path: string;

  @Column({ nullable: true })
  ip: string;

  @Column({ nullable: true })
  user_agent: string;

  @Column({ type: 'text', nullable: true })
  request_body: string;

  @Column({ nullable: true })
  response_code: number;

  @Column({ type: 'text', nullable: true })
  response_body: string;

  @Column({ nullable: true })
  duration: number;

  @Column({ default: 1 })
  status: number;

  @Column({ type: 'text', nullable: true })
  error_message: string;

  @CreateDateColumn()
  createdAt: Date;
}
