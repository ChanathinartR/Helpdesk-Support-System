import { IsNotEmpty, IsString, MinLength } from "@nipacloud/framework/core/util/validator";

export class CreateUserRequest {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password!: string;
}

export class LoginRequest {
    @IsString()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @MinLength(8)
    @IsNotEmpty()
    password!: string;
}
