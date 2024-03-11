import { SetMetadata, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Role } from "../enums/role.enum";
import { RoleGuard } from "../guards/role.guard";

export const AUTHORIZE_KEY = "authorize_role";

/**
 * Decorator function that adds authorization checks to a route.
 * @param role The role required to access the decorated method or class. Defaults to `Role.USER`.
 */
export const Authorize = (role: Role = Role.USER) => {
  return (target, context, descriptor) => {
    SetMetadata(AUTHORIZE_KEY, role)(target, context, descriptor);
    UseGuards(AuthGuard("jwt"), RoleGuard)(target, context, descriptor);
  };
};
