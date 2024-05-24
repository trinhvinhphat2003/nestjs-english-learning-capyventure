import { Inject, Injectable, InternalServerErrorException, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Account, AccountDocument } from "./account.schema";
import { Model } from "mongoose";
import { CreateAccountRequestDTO } from "./dtos/requests/create-account-request.dto";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class AccountService {
    constructor(@InjectModel(Account.name) private accountModel: Model<Account>,
        @Inject(forwardRef(() => 'AUTH_SERVICE_TIENNT')) private readonly authService: AuthService) { }

    async createNewAccount(dto: CreateAccountRequestDTO): Promise<AccountDocument> {
        let newAccount: Account = {
            email: dto.email,
            role: dto.role,
            name: dto.name,
            picture: dto.picture,
            isPremium: false,
            currScription: {
                type: "none",
                startDate: 0,
                endDate: 0
            }
        }
        return new this.accountModel(newAccount).save()
    }

    async getOneWithEmail(email: string): Promise<AccountDocument> {
        let account: AccountDocument = await this.accountModel.findOne({
            email: email
        })
            .exec()
            .then(result => result)
            .catch(error => {
                throw new InternalServerErrorException();
            });
        return account;
    }

    async registerSubcription(accId: string, subcriptionType: string) {
        console.log(JSON.stringify({
            accId,
            subcriptionType
        }, undefined, 4))
        let account: AccountDocument = await this.accountModel.findOne({
            _id: accId
        })
            .exec()
            .then(result => result)
            .catch(error => {
                throw new InternalServerErrorException();
            });
        console.log("Fetch account")
        console.log(JSON.stringify(account, undefined, 4))
        const currentMilliseconds = Date.now();
        // Tạo đối tượng Date từ số mili giây hiện tại
        const currentDate = new Date(currentMilliseconds);
        // Tạo một bản sao của currentDate để thao tác
        const datePlusOneMonth = new Date(currentDate);
        const datePlusOneYear = new Date(currentDate);
        // Cộng thêm 1 tháng
        datePlusOneMonth.setMonth(datePlusOneMonth.getMonth() + 1);

        // Cộng thêm 1 năm
        datePlusOneYear.setFullYear(datePlusOneYear.getFullYear() + 1);

        // Lấy số mili giây từ đối tượng Date đã thay đổi
        const millisecondsPlusOneMonth = datePlusOneMonth.getTime();
        const millisecondsPlusOneYear = datePlusOneYear.getTime();
        let endMilisecond = 0;
        if(subcriptionType === "yearly") {
            endMilisecond = millisecondsPlusOneYear
        } else {
            endMilisecond = millisecondsPlusOneMonth
        }
        if(subcriptionType === "infinity") {
            account.currScription = {
                type: subcriptionType,
                startDate: 1,
                endDate: 1
            }
        } else {
            account.currScription = {
                type: subcriptionType,
                startDate: currentMilliseconds,
                endDate: endMilisecond
            }
        } 
        account.isPremium = true;
        return await new this.accountModel(account).save()
    }
}