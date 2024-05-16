import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Account, AccountDocument } from "./account.schema";
import { Model } from "mongoose";
import { CreateAccountRequestDTO } from "./dtos/requests/create-account-request.dto";

@Injectable()
export class AccountService {
    constructor(@InjectModel(Account.name) private accountModel: Model<Account>) { }

    async createNewAccount(dto: CreateAccountRequestDTO): Promise<AccountDocument> {
        let newAccount: Account = {
            email: dto.email,
            role: dto.role,
            name: dto.name,
            picture: dto.picture,
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
}