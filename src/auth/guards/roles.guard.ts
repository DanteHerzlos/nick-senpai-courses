import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { verify } from 'jsonwebtoken';

import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { headers } = context.switchToHttp().getRequest()

    if(!headers['authorization']) {
        throw new UnauthorizedException()
    }

    const accessToken = headers['authorization'].split(' ')[1]
    try {
        const UserData = verify(accessToken, process.env.ACCESS_SECRET)
        return requiredRoles.some((role) => UserData['role']?.includes(role));
    } catch (e) {
        throw new UnauthorizedException()
    }

  }
}