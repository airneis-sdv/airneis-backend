import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AuthLoginDto } from "./dto/auth-login.dto";
import { AuthRefreshDto } from "./dto/auth-refresh.dto";
import { AuthRegisterDto } from "./dto/auth-register.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("login")
  async login(@Body() authLoginDto: AuthLoginDto, @Res({ passthrough: true }) response: Response) {
    const tokens = await this.authService.validateCredentials(response, authLoginDto);
    return { success: true, tokens };
  }

  @Post("register")
  async register(@Body() authRegisterDto: AuthRegisterDto, @Res({ passthrough: true }) response: Response) {
    const tokens = await this.authService.register(response, authRegisterDto);
    return { success: true, tokens };
  }

  @Post("logout")
  async logout(@Res({ passthrough: true }) response: Response) {
    await this.authService.logout(response);
    return { success: true };
  }

  @Post("refresh")
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() authRefreshDto: AuthRefreshDto) {
    const tokens = await this.authService.refresh(request, response, authRefreshDto);
    return { success: true, tokens };
  }
}
