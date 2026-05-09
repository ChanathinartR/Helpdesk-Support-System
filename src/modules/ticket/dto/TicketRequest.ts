import { TicketStatus } from "@app/data/abstractions/entities";
import { IsIn, IsNotEmpty, IsOptional, IsString, MinLength } from "@nipacloud/framework/core/util/validator";
export class CreateTicketRequest {
    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    title!: string;

    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    description!: string;

    @IsString()
    @MinLength(10)
    @IsNotEmpty()
    contact!: string;
}

export class UpdateTicketRequest {
    @IsString()
    id: string;

    @IsString()
    @MinLength(4)
    @IsOptional()
    title?: string;

    @IsString()
    @MinLength(4)
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    contact?: string;

    @IsOptional()
    @IsIn(["pending", "accepted", "resolved", "rejected"])
    status?: TicketStatus;
}
