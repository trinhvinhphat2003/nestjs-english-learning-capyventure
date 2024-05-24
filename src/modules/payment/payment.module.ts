import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { AccountModule } from "../account/account.module";
import { AuthModule } from "../auth/auth.module";
@Module({
    imports: [
        // MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }])
        AccountModule,
        AuthModule
    ],
    controllers: [
        PaymentController
    ],
    providers: [
        {
            provide: 'PAYMENT_SERVICE_PHATTV',
            useClass: PaymentService,
        }
    ],
    exports: [
        {
            provide: 'PAYMENT_SERVICE_PHATTV',
            useClass: PaymentService,
        }
    ],
})
export class PaymentModule { }