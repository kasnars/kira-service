import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

export interface JwtUserPayload {
  id: number;
  username: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  issueToken(payload: JwtUserPayload) {
    return this.jwtService.sign(payload);
  }

  async login(username: string, password: string) {
    const user = await this.userService.findOneWithPassword(username);

    if (!user) {
      throw new UnauthorizedException('账号或密码错误');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('账号或密码错误');
    }

    const token = this.issueToken({
      id: user.id,
      username: user.username,
    });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
      },
    };
  }

  logout() {
    return { message: '退出登录成功' };
  }

  async getProfile(payload: JwtUserPayload) {
    return this.userService.findByIdWithoutPassword(payload.id);
  }
}
