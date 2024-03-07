import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./config/database.module";
import { UserModule } from "./user/user.module";
import { ResponseExceptionFilter } from "./common/filters/response-exception.filter";
import { APP_FILTER } from "@nestjs/core";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UserModule,
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
