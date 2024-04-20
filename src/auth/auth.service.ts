import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { Role } from "../auth/enums/role.enum";
import { UsersService } from "../user/users.service";
import { AuthLoginDto } from "./dto/auth-login.dto";
import { AuthRefreshDto } from "./dto/auth-refresh.dto";
import { AuthRegisterDto } from "./dto/auth-register.dto";

@Injectable()
export class AuthService {
  readonly isDevelopment: boolean = this.configService.get<string>("NODE_ENV") === "development";

  readonly jwtSecret: string = this.configService.getOrThrow<string>("JWT_SECRET");
  readonly jwtExpiresIn: string = this.configService.getOrThrow<string>("JWT_EXPIRES_IN");

  readonly jwtRefreshSecret: string = this.configService.getOrThrow<string>("JWT_REFRESH_SECRET");
  readonly jwtRefreshExpiresIn: string = this.configService.getOrThrow<string>("JWT_REFRESH_EXPIRES_IN");

  constructor(private readonly configService: ConfigService,
    private readonly usersService: UsersService) { }

  async validateCredentials(response: Response, authLoginDto: AuthLoginDto) {
    const user = await this.usersService.findOneByEmail(authLoginDto.email);

    // Avoid letting attackers know if the email is valid
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const isPasswordValid = await bcrypt.compare(authLoginDto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException("Invalid credentials");

    const tokens = this.generateTokens(user);
    if (authLoginDto.cookies) this.addTokensToCookies(response, tokens);

    return tokens;
  }

  async register(response: Response, authRegisterDto: AuthRegisterDto) {
    const existingUser = await this.usersService.findOneByEmail(authRegisterDto.email);
    if (existingUser) throw new ConflictException("Email is already in use");

    const user = await this.usersService.create({ ...authRegisterDto, role: Role.USER });

    const tokens = this.generateTokens(user);
    if (authRegisterDto.cookies) this.addTokensToCookies(response, tokens);

    return tokens;
  }

  async refresh(request: Request, response: Response, authRefreshDto: AuthRefreshDto) {
    try {
      let token = request.cookies.refresh_token ?? "";

      if (authRefreshDto.refresh_token)
        token = authRefreshDto.refresh_token;

      const decoded: { userId: number } = jwt.verify(token, this.jwtRefreshSecret) as any;

      const user = await this.usersService.findOne(decoded.userId);
      if (!user) throw new UnauthorizedException("User not found");

      const tokens = this.generateTokens(user);
      if (authRefreshDto.cookies) this.addTokensToCookies(response, tokens);

      return tokens;
    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async logout(response: Response) {
    response.cookie("access_token", "", { maxAge: -1 });
    response.cookie("refresh_token", "", {
      path: "/api/auth/refresh",
      httpOnly: true,
      maxAge: -1,
    });
  }

  private generateTokens(user: any) {
    const accessToken = jwt.sign({ id: user.id }, this.jwtSecret, { expiresIn: this.jwtExpiresIn });
    const refreshToken = jwt.sign({ id: user.id }, this.jwtRefreshSecret, { expiresIn: this.jwtRefreshExpiresIn });

    return { accessToken, refreshToken };
  }

  private addTokensToCookies(response: Response, tokens: { accessToken?: string, refreshToken?: string }) {
    if (tokens.accessToken)
      response.cookie("access_token", tokens.accessToken, {
        httpOnly: true,
        maxAge: 1000 * 3600 * 24 * 7,
        secure: !this.isDevelopment,
        sameSite: "lax",
      });

    if (tokens.refreshToken)
      response.cookie("refresh_token", tokens.refreshToken, {
        path: "/api/auth/refresh",
        httpOnly: true,
        maxAge: 1000 * 3600 * 24 * 7,
        secure: !this.isDevelopment,
        sameSite: "strict",
      });
  }
}
