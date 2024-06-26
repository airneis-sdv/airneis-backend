import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";
import { CategoryModule } from "./category/category.module";
import { ResponseExceptionFilter } from "./common/filters/response-exception.filter";
import { DatabaseModule } from "./config/database.module";
import { MaterialModule } from "./material/material.module";
import { MediaModule } from "./media/media.module";
import { OrderModule } from "./order/order.module";
import { ProductModule } from "./product/product.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UserModule,
    AuthModule,
    MediaModule,
    MaterialModule,
    CategoryModule,
    ProductModule,
    OrderModule,
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
