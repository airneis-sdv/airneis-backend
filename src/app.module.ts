import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER } from "@nestjs/core";
import { AuthModule } from './auth/auth.module';
import { ResponseExceptionFilter } from "./common/filters/response-exception.filter";
import { DatabaseModule } from "./config/database.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ResponseExceptionFilter,
    }
  ],
})
export class AppModule { }
