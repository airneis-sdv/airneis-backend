import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "../../user/entities/user.entity";

export const UserRequest = createParamDecorator(
  (_: string, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest().user;
    return user instanceof User ? user : null;
  },
);
