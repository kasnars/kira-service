// 从 typeorm 导入 Entity 相关的装饰器
import {
  Entity,                    // 声明这是一个数据库表对应的实体类
  PrimaryGeneratedColumn,    // 主键列，自动生成（自增）
  Column,                    // 普通列
  CreateDateColumn,          // 创建时间列，插入数据时自动填入当前时间
  UpdateDateColumn,          // 更新时间列，每次更新数据时自动更新为当前时间
} from 'typeorm';

// @Entity('users') 声明这个类对应数据库中的 users 表
// TypeORM 会根据下面的装饰器自动创建/同步表结构
@Entity('users')
export class User {
  // @PrimaryGeneratedColumn() 声明为主键，数据库自动生成（SQLite 中是自增整数）
  @PrimaryGeneratedColumn()
  id: number;

  // @Column({ unique: true }) 声明为普通列，unique 表示数据库级别唯一约束
  // 也就是 username 不能有重复值
  @Column({ unique: true })
  username: string;

  // @Column() 声明为普通列，存储用户密码
  // 注意：这里存的是 bcrypt 加密后的哈希值，不是明文
  @Column()
  password: string;

  // @Column() 声明为普通列，存储用户昵称
  @Column()
  nickname: string;

  // @CreateDateColumn() 创建时间，TypeORM 在 insert 时自动填入当前时间
  @CreateDateColumn()
  createdAt: Date;

  // @UpdateDateColumn() 更新时间，TypeORM 在每次 update 时自动更新为当前时间
  @UpdateDateColumn()
  updatedAt: Date;
}
