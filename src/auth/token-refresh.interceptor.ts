import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Observable, tap } from 'rxjs';
import { AuthService, JwtUserPayload } from './auth.service';

@Injectable()
export class TokenRefreshInterceptor implements NestInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const path = String(request.originalUrl || request.url || '').split('?')[0];
    const method = String(request.method || '').toUpperCase();

    if (this.shouldSkipRefresh(method, path)) {
      return next.handle();
    }

    const payload =
      this.getPayloadFromRequest(request) || this.getPayloadFromAuthHeader(request);

    if (!payload) {
      return next.handle();
    }

    const token = this.authService.issueToken({
      id: payload.id,
      username: payload.username,
    });

    return next.handle().pipe(
      tap(() => {
        response.setHeader('Authorization', `Bearer ${token}`);
        response.setHeader('X-Access-Token', token);
        response.setHeader('X-Token-Refreshed', 'true');
      }),
    );
  }

  private shouldSkipRefresh(method: string, path: string): boolean {
    return (
      (method === 'POST' && path === '/auth/login') ||
      (method === 'POST' && path === '/auth/logout')
    );
  }

  private getPayloadFromRequest(request: { user?: JwtUserPayload }): JwtUserPayload | null {
    if (request.user?.id && request.user?.username) {
      return {
        id: request.user.id,
        username: request.user.username,
      };
    }
    return null;
  }

  private getPayloadFromAuthHeader(request: { headers?: Record<string, string | string[] | undefined> }): JwtUserPayload | null {
    const header = request.headers?.authorization;

    if (!header || typeof header !== 'string') {
      return null;
    }

    const token = header.startsWith('Bearer ')
      ? header.slice('Bearer '.length).trim()
      : header.trim();

    if (!token) {
      return null;
    }

    try {
      const payload = this.jwtService.verify<JwtUserPayload>(token, {
        secret:
          this.configService.get<string>('jwt.secret') ||
          'default-secret-change-in-production',
      });

      if (!payload?.id || !payload?.username) {
        return null;
      }

      return {
        id: payload.id,
        username: payload.username,
      };
    } catch {
      return null;
    }
  }
}
