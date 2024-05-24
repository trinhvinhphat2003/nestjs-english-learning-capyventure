import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_CONFIG, MONGO_HOST } from './configs/mongo.config';
import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { StoryCategoryModule } from './modules/story-category/story-category.module';
import { StoryModule } from './modules/story/story.module';
import { VocabularyModule } from './modules/vocabulary/vocabulary.module';
import { VocabularyTagModule } from './modules/vocabulary-tag/vocabulary-tag.module';
import { MyMiddlewareModule } from './middlewares/middleware.module';
import { VideoModule } from './modules/video/video.module';
import { PaymentModule } from './modules/payment/payment.module';
import { MailModule } from './modules/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_HOST, MONGO_CONFIG),
    AccountModule,
    AuthModule,
    StoryCategoryModule,
    StoryModule,
    VocabularyModule,
    VocabularyTagModule,
    VideoModule,
    PaymentModule,
    MailModule
    // MyMiddlewareModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
