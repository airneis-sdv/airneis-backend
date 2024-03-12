import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator";
import { Role } from "../../auth/enums/role.enum";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public name?: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  public email?: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @IsOptional()
  public password?: string;

  @ApiProperty({
    enum: Role,
    default: Role.USER,
  })
  @IsEnum(Role)
  @IsOptional()
  public role?: Role;
}
