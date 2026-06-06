import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { OperationLogService } from './operation-log.service';

interface RequestUser {
  id: number;
  username: string;
}

interface HttpRequest {
  method: string;
  originalUrl?: string;
  url?: string;
  body?: Record<string, unknown>;
  user?: RequestUser;
  ip?: string;
  headers: Record<string, string | undefined>;
  connection?: { remoteAddress?: string };
}

interface HttpResponse {
  statusCode: number;
  setHeader: (name: string, value: string) => void;
}

const IGNORED_PATHS = ['/api', '/api/', '/health'];
const SENSITIVE_FIELDS = [
  'password',
  'token',
  'key',
  'secret',
  'authorization',
];

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logService: OperationLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const originalUrl = request.originalUrl || request.url || '';
    const body = request.body;
    const user = request.user;
    const headers = request.headers;
    const path = String(originalUrl).split('?')[0];

    if (IGNORED_PATHS.includes(path)) {
      return next.handle();
    }

    if (method === 'GET') {
      return next.handle();
    }

    const startTime = Date.now();
    const userAgent = headers['user-agent'] || '';

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const response = context.switchToHttp().getResponse();
          void this.logService.create({
            user_id: user?.id || null,
            username: user?.username || null,
            module: this.extractModule(path),
            action: this.extractAction(method, path),
            method,
            path,
            ip: this.getClientIp(request),
            user_agent: userAgent.substring(0, 500),
            request_body: this.sanitizeBody(body),
            response_code: response.statusCode,
            duration,
            status: 1,
          });
        },
        error: (error: Error & { status?: number }) => {
          const duration = Date.now() - startTime;
          void this.logService.create({
            user_id: user?.id || null,
            username: user?.username || null,
            module: this.extractModule(path),
            action: this.extractAction(method, path),
            method,
            path,
            ip: this.getClientIp(request),
            user_agent: userAgent.substring(0, 500),
            request_body: this.sanitizeBody(body),
            response_code: error?.status || 500,
            duration,
            status: 0,
            error_message: error?.message || '',
          });
        },
      }),
    );
  }

  private extractModule(path: string): string {
    const segments = path.split('/').filter(Boolean);
    return segments[0] || 'unknown';
  }

  private extractAction(method: string, path: string): string {
    const segments = path.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    if (method === 'POST' && !lastSegment?.match(/^\d+$/)) return 'create';
    if (method === 'PUT' || method === 'PATCH') return 'update';
    if (method === 'DELETE') return 'delete';
    if (lastSegment === 'login') return 'login';
    if (lastSegment === 'logout') return 'logout';
    if (lastSegment === 'roles') return 'assign_role';

    return method.toLowerCase();
  }

  private sanitizeBody(body: Record<string, unknown> | undefined): string {
    if (!body) return '';
    try {
      const sanitized = { ...body };
      for (const field of SENSITIVE_FIELDS) {
        if (sanitized[field]) {
          sanitized[field] = '***';
        }
      }
      return JSON.stringify(sanitized).substring(0, 1000);
    } catch {
      return '';
    }
  }

  private getClientIp(request: HttpRequest): string {
    return (
      request.headers['x-forwarded-for'] ||
      request.headers['x-real-ip'] ||
      request.connection?.remoteAddress ||
      request.ip ||
      ''
    );
  }
}
