import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class UserPaymentMethodDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public label?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public fullName: string;

  @ApiProperty()
  @IsString()
  @MinLength(16)
  @MaxLength(16)
  @IsNotEmpty()
  public cardNumber: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(12)
  @IsNotEmpty()
  public expirationMonth: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(new Date().getFullYear())
  @Max(new Date().getFullYear() + 10)
  public expirationYear: number;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(4)
  @IsNotEmpty()
  public cvv: string;
}