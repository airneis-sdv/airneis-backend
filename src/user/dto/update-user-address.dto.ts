import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { AddressType } from "../enums/address-type.enum";

export class UpdateUserAddressDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public label?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public firstName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public lastName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public address1?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public address2?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public city?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public region?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public postalCode?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public country?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public phone?: string;

  @ApiProperty({ enum: AddressType })
  @IsOptional()
  @IsEnum(AddressType)
  public type?: AddressType;
}
