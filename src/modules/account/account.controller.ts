import { Body, Controller, Get, Inject, InternalServerErrorException, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AccountService } from "./account.service";
import { Account } from "./account.schema";
import { CreateAccountRequestDTO } from "./dtos/requests/create-account-request.dto";

@ApiTags('account')
@Controller('account')
export class AccountController {

    constructor(
        @Inject('ACCOUNT_SERVICE_PHATTV') private readonly accountService: AccountService,
    ) { }
    @Post()
    async createNewAccount(@Body() dto: CreateAccountRequestDTO) {
        try {
            let result: any = await this.accountService.createNewAccount(dto)
            return {
                statusCode: 200,
                data: result
            }
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }
}