import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsInt, IsOptional, IsString } from "class-validator";

export class SelfUpdateUserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public name?: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  public email?: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  public defaultBillingAddressId?: number;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  public defaultShippingAddressId?: number;
}
