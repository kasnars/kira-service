import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

interface Permission {
  name: string;
}

interface Role {
  permissions?: Permission[];
}

interface UserWithRoles {
  roles?: Role[];
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as UserWithRoles | undefined;

    if (!user?.roles) {
      return false;
    }

    const userPermissions = new Set<string>();
    for (const role of user.roles) {
      if (role.permissions) {
        for (const permission of role.permissions) {
          userPermissions.add(permission.name);
        }
      }
    }

    return requiredPermissions.every((permission) =>
      userPermissions.has(permission),
    );
  }
}
