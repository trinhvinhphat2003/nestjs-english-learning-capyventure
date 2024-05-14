import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { AccountService } from "../account/account.service";
import { AuthenticationError } from "./auth.exception";
import logging from "src/configs/logging";
import { AccountDocument, Role } from "../account/account.schema";
import axios from 'axios';

type decodedToken = {
    accountId: string,
    exp: number,
    email: string
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

    async verifyToken(token: string): Promise<boolean> {
        if (!token) {
            throw new AuthenticationError("Token is required", 400);
        }
        const decodedToken = await this.decodeToken(token);
        if (decodedToken.accountId && decodedToken.exp < Date.now()) {
            var account: AccountDocument = await this.accountService.getOneWithEmail(decodedToken.email)
                .then(rs => rs)
                .catch(er => {
                    throw new InternalServerErrorException()
                })
            if (account.email === decodedToken.email && account.id === decodedToken.accountId && account.role === "admin") {
                return true;
            }
        }
        throw new AuthenticationError("Token is not correct", 400);
    }

    private async decodeToken(token: string): Promise<decodedToken> {
        const decodedToken: decodedToken = await this.jwtService.verifyAsync(token)
            .then(rs => rs)
            .catch(err => {
                throw new InternalServerErrorException();
            })
        return decodedToken;
    }

    async getAccountIdFromToken(token: string): Promise<string> {
        if (!token) {
            throw new AuthenticationError("Token is required", 400);
        }

        const decodedToken: decodedToken = await this.decodeToken(token)
            .then(rs => rs)
            .catch(err => {
                throw new InternalServerErrorException();
            })
        logging.info("decodedToken: " + JSON.stringify(decodedToken))
        return decodedToken.accountId;
    }

    async verifyPassword(email: string, password: string): Promise<authResponse> {
        logging.info("Start get one with email", "auth/service/verifyPassword()")
        var account = await this.accountService.getOneWithEmail(email);
        logging.info(JSON.stringify(account), "auth/service/verifyPassword()")
        if (!account) {
            throw new AuthenticationError("Email is not correct", 400);
        }
        let token: string = await this.generateToken({ accountId: account._id, email: account.email })
        return {
            token: token,
            account,
        };

    }

    async verifyGoogleToken(googleToken: string): Promise<authResponse> {
        logging.info("Start get one with email", "auth/service/verifyPassword()")
        let url: string = "https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + googleToken;

        let googleResponse: any = axios.get(url)
            .then(function (response) {
                // handle success
                console.log(response);
            })
            .catch(function (error) {
                throw new AuthenticationError("Token is not valid", 400);
                console.log(error);
            })

        var account = await this.accountService.getOneWithEmail(googleResponse.email);
        if(!account) {
            //create account
            account = await this.accountService.createNewAccount({
                email: googleResponse.email,
                role: Role.member
            })
        }
        logging.info(JSON.stringify(account), "auth/service/verifyGoogleToken()")
        // if (!account) {
        //     throw new AuthenticationError("Email is not correct", 400);
        // }
        let jwt: string = await this.generateToken({ accountId: account._id, email: account.email })
        return {
            token: jwt,
            account,
        };

    }
}