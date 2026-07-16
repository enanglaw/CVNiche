import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from "@nestjs/common";
import { Role } from "@prisma/client";

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException("Authentication required.");
    }

    if (user.role === Role.ADMIN) {
      return true;
    }

    throw new ForbiddenException("Administrative access required.");
  }
}
