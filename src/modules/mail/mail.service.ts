import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) { }

    async sendMail(message: string, email: string, subject: string) {
        await this.mailerService.sendMail({
            to: email,
            // from: '"Support Team" <support@example.com>', // override default from
            subject: subject,
            template: './token', // either change to ./transactional or rename transactional.html to confirmation.html
            context: {
                message: message
            },
        });
    }
}