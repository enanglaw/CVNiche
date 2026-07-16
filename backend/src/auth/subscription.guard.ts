import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from "@nestjs/common";
import { Plan, Role } from "@prisma/client";

@Injectable()
export class SubscriptionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException("Authentication required to verify subscription.");
    }

    // Allow Admins and Pro users
    if (user.role === Role.ADMIN || user.plan === Plan.PRO || user.plan === Plan.ENTERPRISE) {
      return true;
    }

    throw new ForbiddenException("Pro Career Subscription required to access this feature.");
  }
}
