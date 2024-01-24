import { Body, Controller, Headers, HttpCode, HttpStatus, Inject, Post, Res } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import logging from "src/configs/logging";

@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor(
        @Inject('AUTH_SERVICE_TIENNT') private readonly authService: AuthService,
    ) { }

    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: {
                    type: 'string',
                    example: 'tien@gmail.com'
                },
                password: {
                    type: 'string',
                    example: 'admin123'
                },
            },
        },
    })
    @HttpCode(HttpStatus.OK)
    @Post('login/password')
    async loginPassword(
        @Body() body: any,
    ) {
        try {
            logging.info("Start verify email and password", "auth/controller/loginPassword()")
            return await this.authService.verifyPassword(body.email, body.password);
        } catch (error) {
            return JSON.stringify(error);
        }
    }

}