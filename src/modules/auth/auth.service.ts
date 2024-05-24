import { HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, forwardRef } from "@nestjs/common";
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

type AuthResponse = {
    token: string,
    userInfo: {
        name: string,
        picture: string,
        email: string,
        role: Role,
    },
}
@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        @Inject(forwardRef(() => 'ACCOUNT_SERVICE_PHATTV')) private readonly accountService: AccountService,
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
                throw new AuthenticationError("Token is invalid", 401);
            })
        return decodedToken;
    }

    async getAccountIdFromToken(token: string): Promise<string> {
        if (!token) {
            throw new HttpException("Token is required", HttpStatus.UNAUTHORIZED);
        }
        const prefix = "Bearer ";
        if (token.startsWith(prefix)) {
            return token.slice(prefix.length);
        }

        const decodedToken: decodedToken = await this.decodeToken(token)
            .then(rs => rs)
            .catch(err => {
                throw new HttpException("Token is invalid", HttpStatus.FORBIDDEN);
            })
        logging.info("decodedToken: " + JSON.stringify(decodedToken))
        return decodedToken.accountId;
    }

    async verifyPassword(email: string, password: string): Promise<AuthResponse> {
        logging.info("Start get one with email", "auth/service/verifyPassword()")
        var account = await this.accountService.getOneWithEmail(email);
        logging.info(JSON.stringify(account), "auth/service/verifyPassword()")
        if (!account) {
            throw new AuthenticationError("Email is not correct", 400);
        }
        let token: string = await this.generateToken({ accountId: account._id, email: account.email })
        return {
            token: token,
            userInfo: account,
        };

    }

    async verifyGoogleToken(googleAccessToken: string): Promise<AuthResponse> {
        logging.info("Start get one with email", "auth/service/verifyPassword()")
        let url: string = "https://www.googleapis.com/oauth2/v1/userinfo";

        let googleResponse: any = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${googleAccessToken}`
            }
        })
            .then(function (response) {
                // handle success
                return response.data
            })
            .catch(function (error) {
                throw new AuthenticationError("Token is not valid", 400);
                console.log(error);
            })

        var account = await this.accountService.getOneWithEmail(googleResponse.email);
        if (!account) {
            //create account
            account = await this.accountService.createNewAccount({
                email: googleResponse.email,
                role: Role.member,
                name: googleResponse.name,
                picture: googleResponse.picture
            })
        }
        logging.info(JSON.stringify(account), "auth/service/verifyGoogleToken()")
        // if (!account) {
        //     throw new AuthenticationError("Email is not correct", 400);
        // }
        let jwt: string = await this.generateToken({ accountId: account._id, email: account.email })
        return {
            token: jwt,
            userInfo: account,
        };

    }
}