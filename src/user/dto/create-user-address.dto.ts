import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { AddressType } from "../enums/address-type.enum";

export class CreateUserAddressDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public address1: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public address2: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public region: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public postalCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public country: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public phone: string;

  @ApiProperty({ enum: AddressType })
  @IsNotEmpty()
  @IsEnum(AddressType)
  public type: AddressType;
}
