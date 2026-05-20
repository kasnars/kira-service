// 从 @nestjs/mapped-types 导入 PartialType
// PartialType 的作用：把一个 DTO 的所有字段变成可选的
import { PartialType } from '@nestjs/mapped-types';
// 导入创建用户的 DTO，复用它的字段定义和校验规则
import { CreateUserDto } from './create-user.dto';

// UpdateUserDto 继承 PartialType(CreateUserDto)
// 意思是：UpdateUserDto 拥有 CreateUserDto 的所有字段（username、password、nickname）
// 但所有字段都变成了可选的（加了 ?），前端可以只传需要更新的字段
// 比如更新昵称时，只需要传 { nickname: '新昵称' }，不用把 username 和 password 也传一遍
export class UpdateUserDto extends PartialType(CreateUserDto) {}
