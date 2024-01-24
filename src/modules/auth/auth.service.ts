import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { AccountService } from "../account/account.service";
import { AuthenticationError } from "./auth.exception";
import bcrypt from "bcrypt"
import logging from "src/configs/logging";

type decodedToken = {
    email: string,
    exp: number,
}

type authResponse = {
    token: string,
    account: any,
}
@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        @Inject('ACCOUNT_SERVICE_PHATTV') private readonly accountService: AccountService,
    ) { }

    private async generateToken(payload: any): Promise<string> {
        const token = await this.jwtService.signAsync(payload);
        return token;
    }

    private async decodeToken(token: string): Promise<decodedToken> {
        const decodedToken = await this.jwtService.verifyAsync(token);
        return decodedToken;
    }

    async getEmailFromToken(token: string): Promise<string> {
        if (!token) {
            throw new AuthenticationError("Token is required", 400);
        }
        const decodedToken = await this.decodeToken(token);
        return decodedToken.email;
    }

    async verifyPassword(email: string, password: string): Promise<authResponse> {
        logging.info("Start get one with email", "auth/service/verifyPassword()")
        var account = await this.accountService.getOneWithEmail(email);
        logging.info(JSON.stringify(account), "auth/service/verifyPassword()")
        if (!account) {
            throw new AuthenticationError("Email is not correct", 400);
        }
        if (password == account.password) {
            account.password = undefined;
            return {
                token: await this.generateToken({ email: account.email }),
                account,
            };
        }
        throw new AuthenticationError("Password is not correct", 400);
    }

}