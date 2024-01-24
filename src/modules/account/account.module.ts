import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AccountService } from "./account.service";
import { AccountController } from "./account.controller";
import { Account, AccountSchema } from "./account.schema";
@Module({
    imports: [
        MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }])
    ],
    controllers: [
        AccountController,
    ],
    providers: [
        {
            provide: 'ACCOUNT_SERVICE_PHATTV',
            useClass: AccountService,
        }
    ],
    exports: [
        {
            provide: 'ACCOUNT_SERVICE_PHATTV',
            useClass: AccountService,
        }
    ],
})
export class AccountModule { }