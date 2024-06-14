import { Body, Controller, Get, HttpException, HttpStatus, Inject, InternalServerErrorException, Ip, Param, Post, Query, Req, Res } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CreatePaymentRequestDTO } from "./dto/request/CreatePaymentRequest.dto";
import axios from "axios";
import { Request, Response } from "express";
import { MailService } from "../mail/mail.service";
import { PaymentService } from "./payment.service";
import { AccountService } from "../account/account.service";
import logging from "src/configs/logging";
import { AuthService } from "../auth/auth.service";
import { AccountDocument } from "../account/account.schema";

@ApiTags('payment')
@Controller('payment')
export class PaymentController {

    constructor(
        @Inject('MAIL_SERVICE_PHATTV') private readonly mailService: MailService,
        @Inject('PAYMENT_SERVICE_PHATTV') private readonly paymentService: PaymentService,
        @Inject('ACCOUNT_SERVICE_PHATTV') private readonly accountService: AccountService,
        @Inject('AUTH_SERVICE_TIENNT') private readonly authService: AuthService
    ) { }


    @ApiBearerAuth()
    @Get("/create_payment/:package")
    async createNewPayment(
        @Ip() ip,
        @Req() req: Request,
        // @Res() res: Response,
        @Param("package") packageTy: string
    )
    {
         let token: string = req.headers.authorization;
        // let token: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2NjRiNjQ2NjgyZmExM2I5MjE3OWZiYTkiLCJlbWFpbCI6ImFkbWluMkBnbWFpbC5jb20iLCJpYXQiOjE3MTY1MjkxOTMsImV4cCI6MTcxNjYxNTU5M30.ilvad4qk_6mdFj4dpPdmiFnkFDAO7wHVOq_L7Htu1HE"
        logging.info("token: " + token, "createNewPayment()")
        // logging.info("subcriptionType: " + dto.subcriptionType, "createNewPayment()")
        if (!token) {
            throw new HttpException("Token is required", HttpStatus.UNAUTHORIZED);
        }
        const accId: string = await this.authService.getAccountIdFromToken(token);
        const sortObject = (obj) => {
            let sorted = {};
            let str = [];
            let key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    str.push(encodeURIComponent(key));
                }
            }
            str.sort();
            for (key = 0; key < str.length; key++) {
                sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
            }
            return sorted;
        }
        try {
            const moment = require('moment');
            process.env.TZ = 'Asia/Ho_Chi_Minh';

            let date = new Date();
            let createDate = moment(date).format('YYYYMMDDHHmmss');

            const ipAddr = ip;

            let tmnCode = "0HMW9F90"
            let secretKey = "4IKW54V2L7D1RN4L8PDKTP2Y2UP3O9BI"
            let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
            let returnUrl = `https://capyventure.eastasia.cloudapp.azure.com/payment/vnpay_return/${packageTy}/${accId}`
            let orderId = moment(date).format('DDHHmmss');
            let amount = 10000;
            if(packageTy === "yearly") {
                amount = 100000
            } else if(packageTy === "infinity") {
                amount = 200000
            }
            else {
                amount = 50000
            }
            let bankCode = "";
            let locale = 'vn';
            let currCode = 'VND';
            let vnp_Params = {};
            vnp_Params['vnp_Version'] = '2.1.0';
            vnp_Params['vnp_Command'] = 'pay';
            vnp_Params['vnp_TmnCode'] = tmnCode;
            vnp_Params['vnp_Locale'] = locale;
            vnp_Params['vnp_CurrCode'] = currCode;
            vnp_Params['vnp_TxnRef'] = orderId;
            vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
            vnp_Params['vnp_OrderType'] = 'other';
            vnp_Params['vnp_Amount'] = amount * 100;
            vnp_Params['vnp_ReturnUrl'] = returnUrl;
            vnp_Params['vnp_IpAddr'] = ipAddr;
            vnp_Params['vnp_CreateDate'] = createDate;
            if (bankCode !== null && bankCode !== '') {
                vnp_Params['vnp_BankCode'] = bankCode;
            }

            vnp_Params = sortObject(vnp_Params);

            let querystring = require('qs');
            let signData = querystring.stringify(vnp_Params, { encode: false });
            let crypto = require("crypto");
            let hmac = crypto.createHmac("sha512", secretKey);
            let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
            vnp_Params['vnp_SecureHash'] = signed;
            vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
            console.log(vnpUrl)
            // res.redirect(302, vnpUrl);
            return {
                statusCode: 200,
                data: vnpUrl
            }
            // const response = await axios.get('https://api.example.com/data');
            // console.log(JSON.stringify(response, undefined, 4))
        } catch (error) {
            throw error;
        }
    }

    @Get("/vnpay_return/:packageType/:accId")
    async response(@Query() vnp_Params: any, @Res() res: Response, @Param('packageType') subcriptionType: string, @Param('accId') accId: string) {
        const account: AccountDocument = await this.accountService.registerSubcription(accId, subcriptionType)
        this.mailService.sendMail(`Hi ${account.name}! You successfully register ${subcriptionType} package`, account.email, "[Capyventure] Scription successfully")
        console.log(JSON.stringify(vnp_Params, undefined, 4))
        res.redirect(302, "https://capy-venture.vercel.app/home?payment_success=true");
    }

}