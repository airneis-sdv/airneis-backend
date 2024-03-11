import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { User } from "src/user/entities/user.entity";
import { Role } from "../enums/role.enum";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const role = this.reflector.get<Role>("authorize_role", context.getHandler());

    const user = context.switchToHttp().getRequest().user;
    if (!user || !(user instanceof User)) throw new UnauthorizedException();

    if (user.role === Role.ADMIN)
      return true;

    return user.role === role;
  }
}
