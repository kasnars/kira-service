import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createDecipheriv, createHash } from 'crypto';
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
    private readonly configService: ConfigService,
  ) {}

  private aesDecrypt(encrypted: string): string {
    const secret = this.configService.get<string>('aes.secret') || '0809';
    const buffer = Buffer.from(encrypted, 'base64');

    const md5Hash = (data: Buffer) => createHash('md5').update(data).digest();

    if (buffer.slice(0, 8).toString() === 'Salted__') {
      const salt = buffer.slice(8, 16);
      const keyMaterial = Buffer.concat([
        md5Hash(Buffer.from(secret)),
        md5Hash(Buffer.concat([Buffer.from(secret), salt])),
        md5Hash(
          Buffer.concat([Buffer.from(secret), salt, Buffer.from(secret)]),
        ),
      ]);
      const key = keyMaterial.slice(0, 32);
      const iv = keyMaterial.slice(16, 32);
      const data = buffer.slice(16);

      const decipher = createDecipheriv('aes-256-cbc', key, iv);
      let decrypted = decipher.update(data);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString('utf8');
    }

    const iv = buffer.slice(0, 16);
    const data = buffer.slice(16);
    const key = Buffer.alloc(32);
    Buffer.from(secret).copy(key);

    const decipher = createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(data);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
  }

  issueToken(payload: JwtUserPayload) {
    return this.jwtService.sign(payload);
  }

  async login(username: string, password: string) {
    const decryptedPassword = this.aesDecrypt(password);

    const user = await this.userService.findOneWithPassword(username);

    if (!user) {
      throw new UnauthorizedException('账号或密码错误');
    }

    const passwordMatch = await bcrypt.compare(
      decryptedPassword,
      user.password,
    );

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
