import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "src/user/users.service";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService,
    private readonly usersService: UsersService) {
    super({
      jwtFromRequest: JwtStrategy.extractJWT,
      ignoreExpiration: false,
      secretOrKey: authService.jwtSecret,
    });
  }

  private static extractJWT(req: Request) {
    if (!req.cookies.access_token) return null;
    return req.cookies.access_token;
  }

  async validate(payload: any) {
    try {
      return await this.usersService.findOne(payload.id);
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}