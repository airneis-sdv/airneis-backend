import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsString, MinLength } from "class-validator";
import { Role } from "../../auth/enums/role.enum";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @IsString()
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
  @IsEnum(Role)
  public role: Role;
}
