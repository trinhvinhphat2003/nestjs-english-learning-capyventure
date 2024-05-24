import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global() // 👈 optional to make module global
@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => ({
                // transport: config.get("MAIL_TRANSPORT"),
                // or
                transport: {
                    host: "smtp.gmail.com",
                    // port: config.get("MAIL_PORT"),
                    secure: false,
                    auth: {
                        user: "trinhvinhphat16112003@gmail.com",
                        pass: "erzphyxoqzoetqns",
                    },
                },
                defaults: {
                    from: `"No Reply" <Capyventure>`,
                },
                template: {
                    dir: join(__dirname, 'templates'),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [
        {
            provide: 'MAIL_SERVICE_PHATTV',
            useClass: MailService,
        }
    ],
    exports: [
        {
            provide: 'MAIL_SERVICE_PHATTV',
            useClass: MailService,
        }
    ],
})
export class MailModule { }