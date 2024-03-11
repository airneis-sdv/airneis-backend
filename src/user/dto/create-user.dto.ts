import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Role } from "../../auth/enums/role.enum";

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty()
  @IsEmail()
  public email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  public password: string;

  @ApiProperty({
    enum: Role,
    default: Role.USER,
  })
  @IsNotEmpty()
  @IsEnum(Role)
  public role: Role;
}
